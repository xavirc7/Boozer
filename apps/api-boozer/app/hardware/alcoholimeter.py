import time
# import smbus2
# import adafruit_dht
# import board

# --- CONFIGURACIÓN DEL ADS1115 (Mesa de control manual) ---
# Dirección I2C por defecto del ADS1115
ADS1115_ADDRESS = 0x48

# Punteros de registros
POINTER_CONVERSION = 0x00
POINTER_CONFIG = 0x01

# Configuración para Canal A0, Ganancia +/-6.144V (Fsafe), Modo Single-Shot
# Bit OS(1) + MUX(100 -> A0) + PGA(001 -> +/-6.144V) + MODE(1 -> Single-shot) = 0xC3
CONFIG_MSB = 0xC3
# 128 SPS (000) + COMP_MODE(0) + COMP_POL(0) + COMP_LAT(0) + COMP_QUE(11 -> Desactivado) = 0x83
CONFIG_LSB = 0x83

def leer_ads1115_canal0(bus):
    try:
        # Enviar bytes de configuración para iniciar la lectura en A0
        bus.write_i2c_block_data(ADS1115_ADDRESS, POINTER_CONFIG, [CONFIG_MSB, CONFIG_LSB])

        # Esperar a que la conversión termine (128 SPS toma aprox 8ms)
        time.sleep(0.05)

        # Leer los 2 bytes de datos del registro de conversión
        datos = bus.read_i2c_block_data(ADS1115_ADDRESS, POINTER_CONVERSION, 2)

        # Convertir los dos bytes de 8 bits en un entero de 16 bits
        valor_crudo = (datos[0] << 8) | datos[1]

        # El ADS1115 es de 16 bits con signo (0 a 32767 para voltajes positivos)
        if valor_crudo > 32767:
            valor_crudo -= 65536

        # Con ganancia 2/3, cada unidad (LSB) equivale a 0.1875 mV (0.0001875 V)
        voltaje = valor_crudo * 0.0001875

        return valor_crudo, voltaje
    except Exception as e:
        print(f"❌ Error físico leyendo I2C: {e}")
        return 0, 0.0

def correction_factor(temperature: float):
    # TODO: improve
    return 1.0 - 0.012 * (temperature - 20.0)

def voltage_to_bac(
    voltage_out: float,
    temperature_value: float,
    ro: float,
    rl: float = 200,
    a: float = 0.4,
    b: float = -2.7
):
    """
        Args:
            - voltage_out: Voltage out of the system
            - temperature_value: Temperature measured by the sensor
            - ro (kohms): Resistance of the system in clean air
            - rl (kohms): Resistance of the system before GND. Manufacturer provides it.
            - a: Coeficient extracted from the log graphic of the sensor
            - b: Coeficient extracted from the log graphic of the sensor

            - concentration (mg/L)
    """
    if voltage_out <= 0.001:
        return 0.0

    voltage_ratio = (5.0 - voltage_out) / voltage_out
    rs = rl * voltage_ratio
    rs_compensated = rs * correction_factor(temperature_value)
    ratio = rs_compensated / ro
    concentration = a * pow(ratio, b)

    return concentration

def get_voltage_output(bus, dht):
    try:
        while True:
            # Lectura directa del MQ-3 saltándonos a Adafruit Blinka
            valor_adc, voltaje = leer_ads1115_canal0(bus)

            # Lectura del DHT22
            try:
                temperatura = dht.temperature
                humedad = dht.humidity
                if temperatura is not None and humedad is not None:
                    print(f"🌡️ {temperatura:.1f}°C  💧 {humedad:.1f}%   |   ", end="")
                else:
                    print("⚠️ Error DHT: Lectura vacía   |   ", end="")
            except RuntimeError:
                # Es normal que el DHT falle ocasionalmente por timing en Linux
                print("⚠️ Leyendo DHT...               |   ", end="")
            except Exception as e:
                print(f"⚠️ DHT falló: {e}   |   ", end="")

            # Mostrar datos del MQ-3
            bac = voltage_to_bac(voltaje, temperatura, 30)
            bac_adc= voltage_to_bac(valor_adc, temperatura, 30)
            print(f"MQ-3 → ADC: {valor_adc:5d}  |  Voltaje: {voltaje:.3f} V")
            print(f"voltage bac: {bac}       adc bac: {bac_adc}")
            time.sleep(2)
    except KeyboardInterrupt:
        print("\n🔚 Programa finalizado. Liberando recursos...")
        dht.exit()