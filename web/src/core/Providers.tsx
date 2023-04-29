import React, { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Provider } from "react-redux"
import { store } from "@/redux"
import { AuthProvider, EmailProvider, PostProvider } from "@/context"

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Provider store={store}>
        <AuthProvider>
          <PostProvider>
            <EmailProvider>{children}</EmailProvider>
          </PostProvider>
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  )
}
