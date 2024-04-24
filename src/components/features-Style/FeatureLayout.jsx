'use client'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../store/reducers/languageReducer'
import StyleOne from './StyleOne'
import StyleTwo from './StyleTwo'
import StyleThree from './StyleThree'
import StyleFour from './StyleFour'
import StyleFive from './StyleFive'
import { translate } from '../../utils'
import Skeleton from 'react-loading-skeleton'
import StyleSix from './StyleSix'
import { useQuery } from '@tanstack/react-query'
import { access_key, getLanguage } from 'src/utils/api'
import { locationData } from 'src/store/reducers/settingsReducer'
import { getFeatureSectionApi } from 'src/hooks/getFeatureSectionApi'

const FeatureLayout = () => {
  let { id: language_id } = getLanguage()

  // current language
  const currentLanguage = useSelector(selectCurrentLanguage)
  const location = useSelector(locationData)
  const storedLatitude = location && location.lat
  const storedLongitude = location && location.long

  const getFeatureSection = async () => {
    try {
      const { data } = await getFeatureSectionApi.getFeatureSection({
        access_key: access_key,
        language_id: language_id,
        latitude: storedLatitude,
        longitude: storedLongitude
      })
      return data.data
    } catch (error) {
      console.log(error)
    }
  }

  // react query
  const { isLoading, data: Data } = useQuery({
    queryKey: ['mainfeatureSection', currentLanguage, location],
    queryFn: getFeatureSection
  })
  const SelectType = () => {
    return (
      Data &&
      Data.map((item, index) => {
        if (item.news_type === 'news') {
          if (item.style_web === 'style_1') {
            return <StyleOne key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_2') {
            return <StyleTwo key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_3') {
            return <StyleThree key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_4') {
            return <StyleFour key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_5') {
            return <StyleFive key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_6') {
            return <StyleSix key={index} visLoading={isLoading} Data={item} />
          }
        } else if (item.news_type === 'breaking_news') {
          if (item.style_web === 'style_1') {
            return <StyleOne key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_2') {
            return <StyleTwo key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_3') {
            return <StyleThree key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_4') {
            return <StyleFour key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_5') {
            return <StyleFive key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_6') {
            return <StyleSix key={index} isLoading={isLoading} Data={item} />
          }
        } else if (item.news_type === 'videos') {
          if (item.style_web === 'style_1') {
            return <StyleOne key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_2') {
            return <StyleTwo key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_3') {
            return <StyleThree key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_4') {
            return <StyleFour key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_5') {
            return <StyleFive key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_6') {
            return <StyleSix key={index} isLoading={isLoading} Data={item} />
          }
        } else if (item.news_type === 'user_choice') {
          if (item.style_web === 'style_1') {
            return <StyleOne key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_2') {
            return <StyleTwo key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_3') {
            return <StyleThree key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_4') {
            return <StyleFour key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_5') {
            return <StyleFive key={index} isLoading={isLoading} Data={item} />
          } else if (item.style_web === 'style_6') {
            return <StyleSix key={index} isLoading={isLoading} Data={item} />
          }
        }
        return null
      })
    )
  }

  const selectedComponent = SelectType()

  return (
    <>
      {isLoading ? (
        <div className='container'>
          <div className='col-12 loading_data'>
            <Skeleton height={20} count={22} />
          </div>
        </div>
      ) : selectedComponent && selectedComponent.length > 0 ? (
        selectedComponent
      ) : (
        <p className='no_data_available'>{translate('noNews')}</p>
      )}
    </>
  )
}

export default FeatureLayout
