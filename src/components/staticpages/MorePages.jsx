'use client'
import React, { useState } from 'react'
import { IoArrowForwardCircleSharp } from 'react-icons/io5'
import { selectCurrentLanguage } from '../../store/reducers/languageReducer'
import { useSelector } from 'react-redux'
import BreadcrumbNav from '../breadcrumb/BreadcrumbNav'
import { Modal } from 'antd'
import Skeleton from 'react-loading-skeleton'
import { placeholderImage, translate } from '../../utils'
import { getpagesApi } from 'src/hooks/getPagesApi'
import { useQuery } from '@tanstack/react-query'
import { access_key, getLanguage } from 'src/utils/api'
import Layout from '../layout/Layout'
import Card from '../skeletons/Card'
import NoDataFound from '../noDataFound/NoDataFound'

const MorePages = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setmodalData] = useState(null)
  let { id: language_id } = getLanguage()
  const currentLanguage = useSelector(selectCurrentLanguage)

  // api call
  const getpages = async () => {
    try {
      const { data } = await getpagesApi.getpages({
        access_key: access_key,
        language_id: language_id
      })
      return data.data
    } catch (error) {
      console.log(error)
    }
  }

  // react query
  const { isLoading, data: Data } = useQuery({
    queryKey: ['getPages', currentLanguage],
    queryFn: getpages
  })

  const handleModalActive = (e, element) => {
    e.preventDefault()
    setModalOpen(true)
    setmodalData(element)
  }

  return (
    <Layout>
      <BreadcrumbNav SecondElement={translate('More Pages')} ThirdElement='0' />
      <div className='morepages bg-white'>
        <div className='container'>
          {isLoading ? (
            <div className='row'>
              {[...Array(3)].map((_, index) => (
                <div className='col-md-4 col-12' key={index}>
                  <Card isLoading={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className='row'>
              {Data &&
                Data.map(element => (
                  <div className='col-md-4 col-12 mb-4'>
                    <div key={element.id} className='card' onClick={e => handleModalActive(e, element)}>
                      <div className='more-cat-section-card-body'>
                        <h5 id='cat-card-text' className='card-text mb-0'>
                          {element.title}
                        </h5>
                        <button id='btn-cat-more' className='btn' type='button'>
                          <img src={element.page_icon} onError={placeholderImage} alt="icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        centered
        className='custom-modal'
        open={modalOpen}
        maskClosable={false}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={false}
        id='modaltp'
      >
        {isLoading ? (
          <Skeleton height={400} />
        ) : (
          <div>
            {modalData && modalData.page_content ? (
              <p
                id='pp-modal-body'
                className='p-3 mb-0'
                dangerouslySetInnerHTML={{ __html: modalData && modalData.page_content }}
              ></p>
            ) : (
              <NoDataFound/>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  )
}

export default MorePages
