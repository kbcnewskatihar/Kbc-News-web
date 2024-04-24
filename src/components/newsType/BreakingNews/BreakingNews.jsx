'use client'
import { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import TagsSection from '../../tag/TagsSection'
import {
  FacebookIcon,
  WhatsappIcon,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton,
  XIcon
} from 'react-share'
import RelatedBreakingNews from '../../relatedNews/RelatedBreakingNews'
import BreadcrumbNav from '../../breadcrumb/BreadcrumbNav'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../../store/reducers/languageReducer'
import { calculateReadTime, extractTextFromHTML, placeholderImage, translate } from '../../../utils'
import { BsFillPlayFill } from 'react-icons/bs'
import { AiOutlineEye } from 'react-icons/ai'
import VideoPlayerModal from '../../videoplayer/VideoPlayerModal'
import Skeleton from 'react-loading-skeleton'
import { BiTime } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { AllBreakingNewsApi } from 'src/hooks/allBreakingNewsApi'
import { access_key, getLanguage, getUser } from 'src/utils/api'
import { useQuery } from '@tanstack/react-query'
import { getAdsSpaceNewsDetailsApi } from 'src/hooks/adSpaceApi'
import Layout from 'src/components/layout/Layout'
import { settingsData } from 'src/store/reducers/settingsReducer'

const BreakingNews = () => {
  const [FontSize, setFontSize] = useState(14)
  const [Video_url, setVideo_url] = useState()
  const [modalShow, setModalShow] = useState(false)
  const router = useRouter()
  const query = router.query
  const SettingsData = useSelector(settingsData)
  const currentUrL = `${process.env.NEXT_PUBLIC_WEB_URL}${router.asPath}`
  const BNid = query.slug
  let { id: language_id } = getLanguage()
  let user = getUser()
  const currentLanguage = useSelector(selectCurrentLanguage)

  const handleVideoUrl = url => {
    setModalShow(true)
    setVideo_url(url)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // api call
  const getBreakingNewsIdApi = async () => {
    try {
      const { data } = await AllBreakingNewsApi.getBreakingNews({
        language_id: language_id,
        access_key: access_key,
        slug: query.slug
      })

      return data.data ?? null
    } catch (error) {
      console.log(error)
    }
  }

  // api call
  const setBreakingNewsViewApi = async () => {
    try {
      const { data } = await AllBreakingNewsApi.setBreakingNewsView({
        access_key: access_key,
        user_id: user,
        breaking_news_id: BNid
      })

      return data.data ?? null
    } catch (error) {
      console.log(error)
    }
  }

  // api call
  const getAdsSpaceNewsApi = async () => {
    try {
      const { data } = await getAdsSpaceNewsDetailsApi.getAdsSpaceNewsDetails({
        access_key: access_key,
        language_id: language_id
      })
      return data.data ?? null
    } catch (error) {
      console.log(error)
    }
  }

  // react query
  const { isLoading, data } = useQuery({
    queryKey: ['breakingNewsById', access_key, BNid, user, language_id, currentLanguage],
    queryFn: getBreakingNewsIdApi
  })

  const {} = useQuery({
    queryKey: ['setBreakingNewsView', access_key, BNid, user, currentLanguage],
    queryFn: setBreakingNewsViewApi
  })

  const { data: adsdata } = useQuery({
    queryKey: ['getAdsSpaceDetails', access_key, currentLanguage],
    queryFn: getAdsSpaceNewsApi
  })

  const text = extractTextFromHTML(data && data[0]?.description)

  // Calculate read time
  const readTime = calculateReadTime(text)

  return (
    <Layout>
      {data && data?.length > 0 ? (
        <>
          {isLoading ? (
            // Show skeleton loading when data is being fetched
            <div className='col-12 loading_data'>
              <Skeleton height={20} count={22} />
            </div>
          ) : (
            <>
              <BreadcrumbNav SecondElement={translate('breakingNewsLbl')} ThirdElement={data[0].title} />

              <div className='breaking-news-section'>
                <div id='B_NV-main' className='breaking_news_detail'>
                  <div id='B_NV-page' className='container'>
                    {/* ad spaces */}
                    {adsdata && adsdata.ad_spaces_top ? (
                      <div className='ad_spaces mb-5'>
                        <div
                          target='_blank'
                          onClick={() => window.open(adsdata && adsdata.ad_spaces_top.ad_url, '_blank')}
                        >
                          {
                            <img
                              className='adimage'
                              src={adsdata && adsdata.ad_spaces_top.web_ad_image}
                              alt='feature sponsored ads news image'
                              // onError={placeholderImage}
                            />
                          }
                        </div>
                      </div>
                    ) : null}
                    <div className='row'>
                      <div className='col-md-7 col-12'>
                        <div id='B_NV-body'>
                          <p id='btnB_NVCatagory' className='btn btn-sm mb-0'>
                            {translate('breakingnews')}
                          </p>
                          <h1 id='B_NV-title'>{data[0].title}</h1>

                          <div id='B_NV-Header' className=''>
                            <div id='nv-left-head'>
                              <p id='head-lables' className='eye_icon'>
                                <AiOutlineEye size={18} id='head-logos' /> {data && data[0].total_views}
                              </p>
                              <p id='head-lables' className='minute_Read'>
                                <BiTime size={18} id='head-logos' />
                                {readTime && readTime > 1
                                  ? ' ' + readTime + ' ' + translate('minutes') + ' ' + translate('read')
                                  : ' ' + readTime + ' ' + translate('minute') + ' ' + translate('read')}
                              </p>
                            </div>
                            {process.env.NEXT_PUBLIC_SEO === 'true' ? (
                              <div id='B_NV-right-head'>
                                <h6 id='B_NV-Share-Label'>{translate('shareLbl')}:</h6>
                                <FacebookShareButton
                                  url={currentUrL}
                                  title={`${data[0].title} - ${SettingsData && SettingsData?.web_setting?.web_name}`}
                                  hashtag={`${SettingsData && SettingsData?.web_setting?.web_name}`}
                                >
                                  <FacebookIcon size={30} round />
                                </FacebookShareButton>
                                <WhatsappShareButton
                                  url={currentUrL}
                                  title={`${data[0].title} - ${SettingsData && SettingsData?.web_setting?.web_name}`}
                                  hashtag={`${SettingsData && SettingsData?.web_setting?.web_name}`}
                                >
                                  <WhatsappIcon size={30} round />
                                </WhatsappShareButton>
                                <TwitterShareButton
                                  url={currentUrL}
                                  title={`${data[0].title} - ${SettingsData && SettingsData?.web_setting?.web_name}`}
                                  hashtag={`${SettingsData && SettingsData?.web_setting?.web_name}`}
                                >
                                  <XIcon size={30} round />
                                </TwitterShareButton>
                              </div>
                            ) : null}
                          </div>
                          <div id='vps-body-left'>
                            <img id='B_NV-image' src={data[0].image} alt={data[0].title} />
                            {data && data[0].content_value ? (
                              <div className='text-black'>
                                <div id='vps-btnVideo' onClick={() => handleVideoUrl(data[0].content_value)}>
                                  <BsFillPlayFill id='vps-btnVideo-logo' className='pulse' fill='white' size={50} />
                                </div>
                              </div>
                            ) : null}
                          </div>

                          <div id='B_NV-functions' className=''>
                            <div id='B_NV-functions-left'>
                              <Form.Label id='B_NV-font-lable'>{translate('fontsize')}</Form.Label>
                              <Form.Range
                                id='B_NV-FontRange'
                                min={14}
                                max={24}
                                step={2}
                                value={FontSize}
                                onChange={e => setFontSize(e.target.value)}
                              />
                              <div className='d-flex justify-content-between'>
                                <Form.Label id='B_NV-FontRange-labels'>14px</Form.Label>
                                <Form.Label id='B_NV-FontRange-labels'>16px</Form.Label>
                                <Form.Label id='B_NV-FontRange-labels'>18px</Form.Label>
                                <Form.Label id='B_NV-FontRange-labels'>20px</Form.Label>
                                <Form.Label id='B_NV-FontRange-labels'>22px</Form.Label>
                                <Form.Label id='B_NV-FontRange-labels'>24px</Form.Label>
                              </div>
                            </div>
                            <div id='B_NV-functions-right'></div>
                          </div>
                          <p
                            id='B_NV-description'
                            style={{ fontSize: `${FontSize}px`, wordWrap: 'break-word' }}
                            dangerouslySetInnerHTML={{ __html: data[0].description }}
                          ></p>
                        </div>
                      </div>
                      <div className='col-md-5 col-12'>
                        <div id='B_NV-right-section'>
                          {BNid ? <RelatedBreakingNews id={BNid} /> : null}
                          {/* <TagsSection /> */}
                        </div>
                      </div>
                    </div>
                    <VideoPlayerModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      // backdrop="static"
                      keyboard={false}
                      url={Video_url}
                      type_url={data[0].type}
                      // title={data.title}
                    />
                    {/* ad spaces */}
                    {adsdata && adsdata?.ad_spaces_bottom ? (
                      <div className='ad_spaces my-3'>
                        <div
                          target='_blank'
                          onClick={() => window.open(adsdata && adsdata?.ad_spaces_bottom?.ad_url, '_blank')}
                        >
                          {
                            <img
                              className='adimage'
                              src={adsdata && adsdata?.ad_spaces_bottom?.web_ad_image}
                              alt='feature sponsored ads news image'
                            />
                          }
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : null}
    </Layout>
  )
}

export default BreakingNews
