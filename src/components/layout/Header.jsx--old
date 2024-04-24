'use client'
import React, { useEffect, useState } from 'react'
import { BiBell, BiUserCircle } from 'react-icons/bi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from 'react-bootstrap/Button'
import { getAuth, signOut } from 'firebase/auth'
import Dropdown from 'react-bootstrap/Dropdown'
import {
  loadLanguageLabels,
  loadLanguages,
  selectCurrentLanguage,
  selectLanguages,
  setCurrentLanguage
} from '../../store/reducers/languageReducer'
import { useSelector } from 'react-redux'
import {
  getSiblings,
  slideToggle,
  slideUp,
  getClosest,
  isLogin,
  translate,
  truncateText,
  profileimgError,
  profileimg,
  placeholderImage
} from '../../utils/index'
import { logoutUser, selectUser } from '../../store/reducers/userReducer'
import SignInModal from '../auth/SignInModal'
import MobilesideBar from '../mobileNavbar/MobilesideBar'
import { settingsData } from '../../store/reducers/settingsReducer'
import { AiOutlineSearch } from 'react-icons/ai'
import { SetSearchPopUp } from '../../store/stateSlice/clickActionSlice'
import { store } from '../../store/store'
import FirebaseData from 'src/utils/Firebase'
import { useQuery } from '@tanstack/react-query'
import { getUserByIdApi } from 'src/hooks/getuserbyId'
import { access_key, getUser } from 'src/utils/api'
import { CategoriesApi } from 'src/hooks/categoriesApi'
import toast from 'react-hot-toast'
import { accountDeleteApi } from 'src/store/actions/campaign'
import { Modal } from 'antd'
const { confirm } = Modal

const Header = () => {
  const userData = useSelector(selectUser)
  const { authentication } = FirebaseData()
  const [modalShow, setModalShow] = useState(false)
  const [islogout, setIsLogout] = useState(false) // eslint-disable-next-line
  const [isloginloading, setisloginloading] = useState(true) // eslint-disable-next-line
  const [profileModal, setProfileModal] = useState(false)
  const [isuserRole, setisuserRole] = useState(false)
  let user = getUser()
  const navigate = useRouter()
  const auth = getAuth()

  const languagesData = useSelector(selectLanguages)

  const currentLanguage = useSelector(selectCurrentLanguage)

  const settings = useSelector(settingsData)

  // user roles api call
  const getUserById = async () => {
    if (!userData.data.firebase_id) return false
    try {
      const { data } = await getUserByIdApi.getUserById({
        access_key: access_key
      })

      if (data && data.data.status === 0) {
        toast.error('You are deactivated by admin!')
        signOut(authentication)
          .then(() => {
            logoutUser()
            navigate.push('/')
          })
          .catch(error => {
            toast.error(error)
          })
        return false
      }

      if (data && data.data) {
        const roles = data.data.role
        if (roles !== 0) {
          setisuserRole(true)
        }
        return data.data
      } else {
        // Handle the case when data or data.data is undefined or empty
        // Return an appropriate value or handle the situation accordingly
        // For example:
        // setisuserRole(false);
        return []
      }
    } catch (error) {}
  }

  // react query
  const { refetch } = useQuery({
    queryKey: ['userRoles', userData],
    queryFn: getUserById,
    staleTime: 0
  })

  useEffect(() => {
    refetch()
  }, [])

  // api call
  const categoriesApi = async () => {
    try {
      const { data } = await CategoriesApi.getCategories({
        access_key: access_key,
        offset: '0',
        limit: '16',
        language_id: currentLanguage.id
      })
      return data.data
    } catch (error) {
      console.log(error)
    }
  }

  // react query
  const { data: Data } = useQuery({
    queryKey: ['header-categories', currentLanguage],
    queryFn: categoriesApi
  })

  // language change
  const languageChange = (name, code, id) => {
    loadLanguageLabels({ code: code })
    setCurrentLanguage(name, code, id)
  }

  useEffect(() => {
    loadLanguages({
      onSuccess: response => {
        if (currentLanguage.code == null) {
          // eslint-disable-next-line
          // eslint-disable-next-line
          let index =
            response &&
            response.data.filter(data => {
              if (data.code === settings.default_language.code) {
                return { code: data.code, name: data.language, id: data.id }
              }
            })

          setCurrentLanguage(index[0].language, index[0].code, index[0].id)
        }
      },
      onError: error => {
        console.log(error)
      }
    })
  }, [currentLanguage])

  useEffect(() => {
    if (userData.data !== null) {
      setIsLogout(true)
      setisloginloading(false)
    } else {
      setIsLogout(false)
      setisloginloading(true)
    } // eslint-disable-next-line
  }, [])

  const logout = async () => {
    confirm({
      title: 'Logout',
      content: 'Are you sure to do this?',
      centered: true,
      async onOk() {
        try {
          await new Promise((resolve, reject) => {
            signOut(authentication)
              .then(() => {
                logoutUser()
                window.recaptchaVerifier = null
                setIsLogout(false)
                navigate.push('/')
                resolve() // Resolve the promise when signOut is successful
              })
              .catch(error => {
                toast.error(error)
                reject(error) // Reject the promise if there's an error
              })
          })
        } catch (e) {
          console.log('Oops errors!')
        }
      },
      onCancel() {}
    })
  }

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
  }

  const onClickHandler = e => {
    const target = e.currentTarget
    const parentEl = target.parentElement
    if (parentEl?.classList.contains('menu-toggle') || target.classList.contains('menu-toggle')) {
      const element = target.classList.contains('icon') ? parentEl : target
      const parent = getClosest(element, 'li')
      const childNodes = parent.childNodes
      const parentSiblings = getSiblings(parent)
      parentSiblings.forEach(sibling => {
        const sibChildNodes = sibling.childNodes
        sibChildNodes.forEach(child => {
          if (child.nodeName === 'UL') {
            slideUp(child, 1000)
          }
        })
      })
      childNodes.forEach(child => {
        if (child.nodeName === 'UL') {
          slideToggle(child, 1000)
        }
      })
    }
  }

  let userName = ''

  const checkUserData = userData => {
    if (userData.data && userData.data.name !== '') {
      return (userName = userData.data.name)
    } else if (userData.data && userData.data.email !== '') {
      return (userName = userData.data.email)
    } else if (userData.data && (userData.data.mobile !== null || userData.data.mobile !== '')) {
      return (userName = userData.data.mobile)
    }
  }

  // set rtl
  const selectedLang = languagesData && languagesData.find(lang => lang.code === currentLanguage.code)
  useEffect(() => {
    if (selectedLang && selectedLang.isRTL === '1') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = `${selectedLang && selectedLang.code}`
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = `${selectedLang && selectedLang.code}`
    }
  }, [selectedLang])

  const searchPopUp = useSelector(state => state.clickAction.searchPopUp)
  const actionSearch = () => {
    store.dispatch(SetSearchPopUp(!searchPopUp))
  }

  // delete account
  const deleteAccount = async e => {
    e.preventDefault()
    confirm({
      title: 'Delete Account',
      content: 'Are you sure to do this?',
      centered: true,
      async onOk() {
        try {
          await new Promise((resolve, reject) => {
            const user = auth.currentUser

            if (user) {
              user
                .delete()
                .then(() => {
                  accountDeleteApi({
                    onSuccess: res => {
                      signOut(authentication)
                        .then(() => {
                          logoutUser()
                          window.recaptchaVerifier = null
                          setIsLogout(false)
                          navigate.push('/')
                        })
                        .catch(error => {
                          toast.error(error.message || 'An error occurred while signing out.')
                        })
                    },
                    onError: err => {
                      console.log(err)
                    }
                  })
                })
                .catch(error => {
                  console.error('Error deleting user account:', error)

                  // Check if the error is "auth/requires-recent-login"
                  if (error.code === 'auth/requires-recent-login') {
                    toast.error('Authentication error: Please log in again before deleting your account.')
                  } else {
                    toast.error('An error occurred while deleting user account.')
                  }
                })
            }
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          })
        } catch (error) {
          console.log(error)
        }
      },
      onCancel() {}
    })
  }

  return (
    <div className='Newsbar'>
      <div className='container'>
        <div className='navbar_content'>
          <div id='News-logo' className='News-logo'>
            <Link href='/' activeclassname='active' exact='true'>
              <img id='NewsLogo' src={settings && settings?.web_setting?.web_header_logo} onError={placeholderImage} alt='logo' />
            </Link>
          </div>

          <div className='Manu-links'>
            <ul className=''>
              <li id='NavHover' className='nav-item'>
                <b>
                  <Link
                    id='nav-links'
                    activeclassname='active'
                    exact='true'
                    className='link-color'
                    aria-current='page'
                    href='/'
                  >
                    {/* {translate('home')} */}
                    Home
                  </Link>
                </b>
              </li>
              {settings && settings.live_streaming_mode === '1' ? (
                <li id='NavHover' className='nav-item'>
                  <b>
                    <Link
                      id='nav-links'
                      activeclassname='active'
                      exact='true'
                      className='link-color'
                      aria-current='page'
                      href='/live-news'
                    >
                      {/* {translate('livenews')} */}
                      Live News
                    </Link>
                  </b>
                </li>
              ) : null}
              {settings && settings.breaking_news_mode === '1' ? (
                <li id='NavHover' className='nav-item'>
                  <b>
                    <Link
                      id='nav-links'
                      activeclassname='active'
                      exact='true'
                      className='link-color'
                      aria-current='page'
                      href='/all-breaking-news'
                    >
                      {/* {translate('breakingnews')} */}
                      Breaking News

                    </Link>
                  </b>
                </li>
              ) : null}
              <li id='NavHover' className='nav-item'>
                <b>
                  <Link
                    id='nav-links'
                    activeclassname='active'
                    exact='true'
                    className='link-color'
                    aria-current='page'
                    href='/more-pages'
                  >
                    {/* {translate('More Pages')} */}
                    More Pages
                  </Link>
                </b>
              </li>
              <li id='Nav-btns' className='d-flex'>
                {isLogin() && checkUserData(userData) ? (
                  <Dropdown>
                    <Dropdown.Toggle id='btnSignIn' className='me-2'>
                      <img
                        className='profile_photo'
                        src={userData.data && userData.data.profile ? userData.data.profile : profileimg}
                        onError={profileimgError}
                        alt='profile'
                      />
                      {truncateText(userName, 10)}
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ backgroundColor: '#1A2E51' }}>
                      <Dropdown.Item id='btnLogout'>
                        <Link id='btnBookmark' href='/bookmark'>
                          {/* {translate('bookmark')} */}
                          Bookmark
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item id='btnLogout'>
                        <Link id='btnBookmark' href='/user-based-categories'>
                          {/* {translate('managePreferences')} */}
                          Manage Preferences
                        </Link>
                      </Dropdown.Item>

                      {isuserRole ? (
                        <>
                          <Dropdown.Item id='btnLogout'>
                            <Link id='btnBookmark' href='/create-news'>
                              {/* {translate('createNewsLbl')} */}
                              Create News
                            </Link>
                          </Dropdown.Item>

                          <Dropdown.Item id='btnLogout'>
                            <Link id='btnBookmark' href='/manage-news'>
                              {/* {translate('manageNewsLbl')} */}
                              Manage News

                            </Link>
                          </Dropdown.Item>
                        </>
                      ) : null}
                      <Dropdown.Item id='btnLogout'>
                        <Link id='btnBookmark' href='/profile-update'>
                          {/* {translate('update-profile')} */}
                          Update Profile
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item id='btnLogout' onClick={e => deleteAccount(e)}>
                        {/* {translate('deleteAcc')} */}
                        Delete Account
                      </Dropdown.Item>  
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={logout} id='btnLogout' className=''>
                        {/* {translate('logout')} */}
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Button
                    variant='danger'
                    onClick={() => setModalShow(true)}
                    id='btnSignIn'
                    className='me-2'
                    type='button'
                  >
                    <BiUserCircle size={23} id='btnLogo' />
                    {/* {translate('loginLbl')} */}
                    Login
                  </Button>
                )}

                {/* notifiaction */}
                {isLogin() ? (
                  <Link href='/personal-notification' id='btnNotification' type='button' className='btn'>
                    <BiBell size={23} />
                    <span className='noti_badge_data'></span>
                  </Link>
                ) : null}

                {/* searchbar */}
                <div id='btnNotification' type='button' className='btn ms-2' onClick={actionSearch}>
                  <AiOutlineSearch size={23} />
                </div>
              </li>
            </ul>

            <SignInModal
              setIsLogout={setIsLogout}
              setisloginloading={setisloginloading}
              show={modalShow}
              setLoginModalShow={setModalShow}
              onHide={() => setModalShow(false)}
            />
          </div>
          <div className='hamburger-manu'>
            {['end'].map((placement, idx) => (
              <MobilesideBar
                key={idx}
                isuserRole={isuserRole}
                languageChange={languageChange}
                placement={placement}
                name={placement}
                logout={logout}
                onClickHandler={onClickHandler}
                Data={Data}
                modalShow={modalShow}
                setModalShow={setModalShow}
                islogout={islogout}
                setIsLogout={setIsLogout}
                handleShow={handleShow}
                show={show}
                handleClose={handleClose}
                ProfileModal={setProfileModal}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
