/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line spaced-comment
/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PUBLIC_URL: string
      REACT_APP_API_URL: string
      REACT_APP_WS_URL: string
      }
  }
  interface Window {
      Stripe: any
  }
  