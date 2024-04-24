'use client'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../store/reducers/languageReducer'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { translate } from '../../utils'
import Skeleton from 'react-loading-skeleton'
import { settingsData } from '../../store/reducers/settingsReducer'
import Link from 'next/link'
import { CategoriesApi } from 'src/hooks/categoriesApi'
import { access_key } from 'src/utils/api'
import { useQuery } from '@tanstack/react-query'
import { loadCategoryCount, loadSubCategories, subCategories } from 'src/store/reducers/tempDataReducer'
import { useEffect, useState } from 'react'

SwiperCore.use([Navigation, Pagination])
const CatNav = () => {
  const navigate = useRouter()
  const currentLanguage = useSelector(selectCurrentLanguage)
  const categoiresOnOff = useSelector(settingsData)
  const [subCat, setSubCat] = useState([])

  // api call
  const categoriesApi = async () => {
    try {
      const { data } = await CategoriesApi.getCategories({
        access_key: access_key,
        offset: '0',
        limit: '40',
        language_id: currentLanguage.id
      })

      loadCategoryCount({ categoryCount: data?.total });
      return data.data
    } catch (error) {
      console.log(error)
    }
  }

  // react query
  const { data: Data, isLoading } = useQuery({
    queryKey: ['categoriesNav', currentLanguage],
    queryFn: categoriesApi
  })

  // useEffect(() => {
  //   const subCategoriesObject = Data?.reduce((acc, category) => {
  //     if (Array.isArray(category.sub_categories)) {
  //       // Assuming each subcategory has a unique ID, use it as the key
  //       category.sub_categories.forEach(subCategory => {
  //         // acc[subCategory.id] = subCategory;
  //         acc?.push(subCategory)
  //       });
  //     }
  //     return acc;
  //   }, []);
  //   setSubCat(subCategoriesObject)
  // }, [Data])


  const swiperOption = {
    loop: Data && Data.length > 10 ? true : false,
    speed: 3000,
    spaceBetween: 10,
    slidesPerView: 'auto',
    navigation: false,
    freeMode: true,
    observer: true,
    observeParents: true,
    parallax: true,
    breakpoints: {
      1200: {
        slidesPerView: 11
      }
    },
    autoplay: {
      delay: 0
    }
  }

  const handleCategoryChange = (categories) => {
    loadSubCategories({ subCategories: categories.sub_categories });
    if (categories.slug) {
      navigate.push(`/categories-news/${categories.slug}?category_id=${categories.id}`)
    }
  }

  return (
    <>
      {categoiresOnOff && categoiresOnOff.category_mode === '1' ? (
        <>
          {Data && Data.length > 0 ? (
            <div id='cn-main' expand='lg'>
              <div className='container py-2'>
                {isLoading ? (
                  <div>
                    <Skeleton height={200} count={3} />
                  </div>
                ) : (
                  <div className={`cn-main-div ${Data && Data.length > 10 ? 'flex-display' : 'block-display'}`}>

                    <Swiper {...swiperOption}>
                      {Data.map((element, index) => (
                        <SwiperSlide key={element.id} className='text-center'
                          onClick={() => handleCategoryChange(element)}
                        >
                          <span
                            id='catNav-links'
                            // href={{
                            //   pathname: `/categories-news/${element.slug}`,
                            //   query: {
                            //     category_id: element.id
                            //   }
                            // }}
                          >
                          <b>{element.category_name}</b>
                          </span>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    {Data?.length > 10 ? (
                      <button
                        id='catNav-more'
                        onClick={() => {
                          navigate.push('/all-categories')
                        }}
                      >
                        {translate('More >>')}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </>
  )
}

export default CatNav
