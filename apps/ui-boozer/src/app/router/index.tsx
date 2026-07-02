import React from 'react'
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { RootLayout } from '../RootLayout'
import { AttractScreen } from '../../features/attract/AttractScreen'
import { LanguageScreen } from '../../features/language/LanguageScreen'
import { GameModeScreen } from '../../features/gameMode/GameModeScreen'
import { CrewSizeScreen } from '../../features/crewSize/CrewSizeScreen'
import { PlayerNameScreen } from '../../features/playerName/PlayerNameScreen'
import { PaymentScreen } from '../../features/payment/PaymentScreen'
import { CountdownScreen } from '../../features/strawCountdown/CountdownScreen'
import { BlowScreen } from '../../features/blow/BlowScreen'
import { ProcessingScreen } from '../../features/processing/ProcessingScreen'
import { ResultScreen } from '../../features/result/ResultScreen'
import { RankingProcessingScreen } from '../../features/rankingProcessing/RankingProcessingScreen'
import { RankingScreen } from '../../features/ranking/RankingScreen'
import { FinalScreen } from '../../features/final/FinalScreen'

const routes: RouteObject[] = [
  {
    element: React.createElement(RootLayout),
    children: [
      {
        path: '/',
        element: React.createElement(AttractScreen),
      },
      {
        path: '/language',
        element: React.createElement(LanguageScreen),
      },
      {
        path: '/mode',
        element: React.createElement(GameModeScreen),
      },
      {
        path: '/crew-size',
        element: React.createElement(CrewSizeScreen),
      },
      {
        path: '/name',
        element: React.createElement(PlayerNameScreen),
      },
      {
        path: '/payment',
        element: React.createElement(PaymentScreen),
      },
      {
        path: '/countdown',
        element: React.createElement(CountdownScreen),
      },
      {
        path: '/blow',
        element: React.createElement(BlowScreen),
      },
      {
        path: '/processing',
        element: React.createElement(ProcessingScreen),
      },
      {
        path: '/result',
        element: React.createElement(ResultScreen),
      },
      {
        path: '/ranking-processing',
        element: React.createElement(RankingProcessingScreen),
      },
      {
        path: '/ranking',
        element: React.createElement(RankingScreen),
      },
      {
        path: '/final',
        element: React.createElement(FinalScreen),
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
