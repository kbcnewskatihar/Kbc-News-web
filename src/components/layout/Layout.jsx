'use client'
import { useEffect } from 'react'
import { laodSettingsApi, settingsData } from 'src/store/reducers/settingsReducer'
import { useSelector } from 'react-redux'
import { selectCurrentLanguageLabels } from 'src/store/reducers/languageReducer'
import { useRouter } from 'next/router'
import Header from './Header'
import CatNav from '../categories/CatNav'
import WeatherCard from '../weather/WeatherCard'
import SearchPopup from '../search/SearchPopup'
import Footer from './Footer'
import { protectedRoutes } from 'src/routes/routes'
import toast from 'react-hot-toast'
import { selectUser } from 'src/store/reducers/userReducer'
import { usePathname } from 'next/navigation'

const Layout = ({ children }) => {
  const settings = useSelector(settingsData)
  const userData = useSelector(selectUser)
  const router = useRouter()
  const pathname = usePathname()

  useSelector(selectCurrentLanguageLabels)

  // web settings load
  useEffect(() => {
    laodSettingsApi({
      type: '',
      onSuccess: res =>
        document.documentElement.style.setProperty('--primary-color', res && res?.data?.web_setting?.web_color_code),
      onError: error => {
        console.log(error)
      }
    })
    // language laod
  }, [])

  // client side rendering route get and this is only for vercel deploy logic
  useEffect(() => {
    // Check if the slug is present in the URL
    if (process.env.NEXT_PUBLIC_SEO === 'false') {
      if (router.pathname) {
        router.replace(window.location.pathname + window.location.search)
      }
    }
  }, [])

  // Check if the user is authenticated based on the presence of the token
  const isAuthenticated = userData && userData?.data?.token

  // Check if the current route requires authentication
  const requiresAuth = protectedRoutes.includes(pathname)

  useEffect(() => {
    authCheck()
  }, [requiresAuth])

  const authCheck = () => {
    if (requiresAuth) {
      if (isAuthenticated === undefined) {
        router.push('/')
        toast.error('please login first')
        return
      }
    }
  }

  return (
    <>
      {settings ? (
        <>
          <SearchPopup />
          <WeatherCard />
          <Header />
          <CatNav />
          <div>{children}</div>
          <Footer />
        </>
      ) : (
        <div className='loader-container'>
          <div className='loader'></div>
        </div>
      )}
    </>
  )
}
export default Layout
