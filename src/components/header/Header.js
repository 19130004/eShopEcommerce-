import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { FaShoppingCart, FaTimes, FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { auth } from "../../firebase/config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  SET_ACTIVE_USER,
  REMOVE_ACTIVE_USER,
} from "../../redux/slice/authSlice";
import { ShowOnLogin, ShowOnLogout } from "../hiddenLink/hiddenLink";
import { AdminOnlyLink } from "../adminOnlyRoute/AdminOnlyRoute";
const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [displayName, setdisplayName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const closeMenu = () => {
    setShowMenu(false);
  };
  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("Logout Successful");
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
        toast.error(error.message);
      });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        if (user.displayName === null) {
          const u1 = user.email.substring(0, user.email.lastIndexOf("@"));
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setdisplayName(uName);
        } else {
          setdisplayName(user.displayName);
        }
        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName ? user.displayName : user.email,
            userID: user.uid,
          })
        );
        // ...
      } else {
        // User is signed out
        // ...
        setdisplayName("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, [dispatch, displayName]);
  const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");
  const logo = (
    <div className={styles.logo}>
      <Link to="/">
        <h2>
          e<span>Shop</span>.
        </h2>
      </Link>
    </div>
  );
  const cart = (
    <span className={styles.cart}>
      <Link to="/cart">
        Cart
        <FaShoppingCart size={20} />
        <p>0</p>
      </Link>
    </span>
  );
  return (
    <header>
      <div className={styles.header}>
        {logo}

        <nav
          className={
            showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
          }
        >
          <div
            className={
              showMenu
                ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
            onClick={closeMenu}
          ></div>
          <ul onClick={closeMenu}>
            <li className={styles["logo-mobile"]}>
              {logo}
              <FaTimes size={22} color="#fff" onClick={closeMenu} />
            </li>
            <li>
              <AdminOnlyLink>
                <Link to="/admin/home">
                  <button className="--btn --btn-primary">Admin</button>
                </Link>
              </AdminOnlyLink>
            </li>
            <li>
              <NavLink to="/" className={activeLink}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={activeLink}>
                Contact US
              </NavLink>
            </li>
          </ul>
          <div className={styles["header-right"]}>
            <span className={styles.links}>
              <ShowOnLogout>
                <NavLink to="/login" className={activeLink}>
                  Login
                </NavLink>
              </ShowOnLogout>
              <ShowOnLogin>
                <a href="#home" style={{ color: "#ff7722" }}>
                  <FaUserCircle size={16} />
                  Hi, {displayName}
                </a>
              </ShowOnLogin>
              <ShowOnLogout>
                <NavLink to="/register" className={activeLink}>
                  Register
                </NavLink>
              </ShowOnLogout>
              <ShowOnLogin>
                <NavLink to="/order-history" className={activeLink}>
                  {" "}
                  My Orders
                </NavLink>
              </ShowOnLogin>
              <ShowOnLogin>
                <NavLink to="/" onClick={logoutUser}>
                  Logout
                </NavLink>
              </ShowOnLogin>
            </span>
            {cart}
          </div>
        </nav>
        <div className={styles["menu-icon"]}>
          {cart}
          <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
        </div>
      </div>
    </header>
  );
};

export default Header;
