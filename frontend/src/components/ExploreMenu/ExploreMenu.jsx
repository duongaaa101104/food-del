import React from 'react'
import './ExploreMenu.css'
import {menu_list} from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
    <h1>Khám phá menu của chúng tôi</h1>
    <p className='explore-menu-text'>Chọn từ thực đơn đa dạng bao gồm nhiều món ăn ngon miệng. Nhiệm vụ của chúng tôi để đáp ứng chạm khắc của bạn và nâng cao kinh nghiệm ăn uống của bạn, một bữa ăn ngon tại một thời điểm.</p>
    <div className="explore-menu-list">
        {menu_list.map((item,index)=>{
            return(
                <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-list-item">
                    <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                    <p>{item.menu_name}</p>

                </div>
            )
        })}
    </div>
    <hr />
    </div>
  )
}

export default ExploreMenu