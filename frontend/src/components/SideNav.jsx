import React from 'react';
import { Outlet, NavLink } from 'react-router-dom'; 


const SideNav = () => {
  return (
    <>
    <div className="d-flex flex-column flex-shrink-0 text-white p-3 position-fixed top-0 left-0 bottom-0 dark-bg" style={{ width: '18%'}}>
        <span><h2 className='font-serif'>Jazire POS</h2></span>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto mt-3">
        <li className="nav-item">
          <NavLink to={'/'} className='fit-content bg-dark'>
            <h5>Home</h5>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={'/categories'}>
            <h5 className='font-serif'>Categories</h5>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={'/products'}>
            <h5 className='font-serif'>Products</h5>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={'pos'}>
            <h5 className='font-serif'>Point Of Sale</h5>
          </NavLink>
        </li>
        <li className="nav-item font-serif">
          <NavLink to={'/sales'}>
            <h5 className='font-serif'>Sales</h5>
          </NavLink>
        </li>
        <li className="nav-item font-serif my-2">
          <NavLink to={'/reports'}>
            <h5 className='font-serif'>Reports</h5>
          </NavLink>
        </li>

        <li className="nav-item dropdown mt-5 fit-content dark-bg px-2-lg">
          <a className="nav-link dropdown-toggle w-100" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Store management
          </a>
          <ul className="dropdown-menu fit-content mx-auto" aria-labelledby="navbarDropdown">

            <li className="nav-item font-serif">
            <NavLink to={'/company'} className="dropdown-item">
              <h6 className='font-serif text-white'>Company Details</h6>
            </NavLink>
            </li>
            <li className="nav-item font-serif">
            <NavLink to={'/users'} className="dropdown-item">
              <h6 className='font-serif'>Users</h6>
            </NavLink>
            </li>
            <li className="nav-item font-serif">
            <NavLink to={'/login'} className="dropdown-item">
              <h6 className='font-serif'>Login</h6>
            </NavLink>
            </li>
          </ul>
        </li>

      </ul>
    </div>
    <div className='main-content p-4'>
        <Outlet/>
    </div>
    </>
  );
};

export default SideNav