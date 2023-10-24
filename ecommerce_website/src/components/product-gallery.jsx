import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getProductList } from '../services/product'
import { constants } from '../utils/constants'

function ProductGallery() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    // get the list of products from server
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const response = await getProductList()
    if (response['status'] === 'success') {
      setProducts(response['data'])
    } else {
      toast.error('Error while calling get /product api')
    }
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 10 }}>Product Gallery</h1>
      <div className='row' style={{ marginTop: 50 }}>
        {products.map((product) => {
          return (
            <div className='col-md-3'>
              <div className='card'>
                <img
                  src={constants.serverUrl + '/' + product['image']}
                  style={{ height: 200 }}
                  alt=''
                />
                <div className='card-body'>
                  <h5 className='card-title'>{product['title']}</h5>
                  <div className='card-text'>
                    <div>{product['company']}</div>
                    <div>₹ {product['price']}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductGallery
