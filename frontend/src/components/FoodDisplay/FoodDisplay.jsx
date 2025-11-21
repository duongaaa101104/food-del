import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

  // 1. Lấy thêm searchValue từ Context
  const { food_list, searchValue } = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      <h2>Top món ăn gần bạn</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          
          // 2. Kiểm tra xem món ăn có thuộc danh mục đã chọn không
          if (category === "All" || category === item.category) {
            
            // 3. LOGIC TÌM KIẾM:
            // Nếu không nhập gì (searchValue rỗng) -> Hiện hết
            // HOẶC Nếu tên món ăn có chứa từ khóa -> Hiện món đó
            if (searchValue === "" || item.name.toLowerCase().includes(searchValue.toLowerCase())) {
                return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
            }
          }
          
          return null;
        })}
      </div>
    </div>
  )
}

export default FoodDisplay