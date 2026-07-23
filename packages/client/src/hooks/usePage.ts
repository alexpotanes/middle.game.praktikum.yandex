import { useEffect } from 'react'
import { useDispatch, useSelector, useStore } from '../store'
import {
  setPageHasBeenInitializedOnServer,
  selectPageHasBeenInitializedOnServer,
} from '../slices/ssrSlice'
import type { PageInitArgs, PageInitContext } from '../router'
import { getAuthToken } from '../utils/auth'

const createContext = (): PageInitContext => ({
  clientToken: getAuthToken(),
})

type PageProps = {
  initPage: (data: PageInitArgs) => Promise<unknown>
}

export const usePage = ({ initPage }: PageProps) => {
  const dispatch = useDispatch()
  const pageHasBeenInitializedOnServer = useSelector(
    selectPageHasBeenInitializedOnServer
  )
  const store = useStore()

  useEffect(() => {
    if (pageHasBeenInitializedOnServer) {
      dispatch(setPageHasBeenInitializedOnServer(false))
      return
    }
    initPage({ dispatch, state: store.getState(), ctx: createContext() })
  }, [])
}
