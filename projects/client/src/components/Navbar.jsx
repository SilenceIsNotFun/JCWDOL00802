import React from "react";
import {
  Avatar,
  AvatarBadge,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import {
  AiOutlineMessage,
  AiOutlineSearch,
  AiOutlineShopping,
  AiOutlineUser,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";
import { logoutAction } from "../actions/userAction";

const Navbar = (props) => {
  const dispatch = useDispatch();

  const { email, role } = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      email: state.userReducer.email,
      role: state.userReducer.role,
    };
  });
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="Logo">
          <img
            src={require("../Assets/logotengah2.png")}
            alt="Click N Collect"
            style={{ height: 40, objectFit: "scale-down" }}
          />
        </Link>
        {/* Toggle kalo layarny mengecil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Kategori */}
          <Menu>
            <MenuButton
              className="nav-item main-content-color"
              style={{ cursor: "pointer" }}
            >
              Kategori
            </MenuButton>
            {/* Drop Down Kategori */}
            <MenuList>
              <MenuItem>Parfum</MenuItem>
              <MenuItem>Makanan</MenuItem>
            </MenuList>
          </Menu>
          {/* Pencarian / Search Bar */}
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<AiOutlineSearch />}
            />
            <Input type="tel" placeholder="Ketik kata kunci" maxWidth={500} />
          </InputGroup>
          {/* Gambar profiling, cart, dan transaction */}
          <Link to="/profile">
            <AiOutlineUser size={40} color={"#f96c08"} className="mx-1" />
          </Link>
          <Link to="/cart">
            <AiOutlineShopping size={40} color={"#f96c08"} className="mx-1" />
          </Link>
          <Link to="/transaction">
            <AiOutlineMessage size={40} color={"#f96c08"} className="mx-1" />
          </Link>
          {/* Avatar user (Kalau Login) / Masuk dan Registasi (Kalau belum Login) */}
          <form className="login" role="search" style={{ zIndex: 10 }}>
            {props.loading ? (
              <Spinner />
            ) : email && !props.loading ? (
              <Menu>
                <MenuButton type="button">
                  <Avatar
                    name={email}
                    size="md"
                    className="avatar"
                    textColor={"black"}
                  >
                    <AvatarBadge boxSize="1em" bg="green.500" />
                  </Avatar>
                </MenuButton>
                {/* Drop Down */}
                <MenuList textColor="black">
                  <Link to="profile">
                    <MenuItem>{email}</MenuItem>
                  </Link>
                  <MenuDivider />
                  {/* Bila admin, tapi nanti di back end harus ganti super admin rolenya jadi 3 aja */}
                  {role == 2 || role == 3 ? (
                    <div>
                      <Link to="/admin/products">
                        <MenuItem>Pengelolaan Produk</MenuItem>
                      </Link>

                      <Link to="/admin/transaction">
                        <MenuItem>Pengelolaan Transaksi</MenuItem>
                      </Link>
                      <Link to="/admin/warehouse">
                        <MenuItem>Pengelolaan Gudang</MenuItem>
                      </Link>
                      <Link to="/admin/salesreport">
                        <MenuItem>Laporan penjualan</MenuItem>
                      </Link>
                    </div>
                  ) : (
                    // Bila user, karena user kodenya 1, jadi semua yg lbh dr 1 itu admin atau super admin
                    <div>
                      <Link to="/cart">
                        <MenuItem>Keranjang</MenuItem>
                      </Link>
                      <Link to="/transaction">
                        <MenuItem>Transaksi Pembelian</MenuItem>
                      </Link>
                    </div>
                  )}
                  <MenuDivider />
                  {/* Logout */}
                  <Link to="/">
                    <MenuItem onClick={() => dispatch(logoutAction())}>
                      Logout
                      <AiOutlineLogout className="ms-2" />
                    </MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            ) : (
              // Bila login bersifat false, keluar tombol utk login dan regis
              <ButtonGroup>
                <Link to="/login">
                  <Button type="button" colorScheme="orange" variant="solid">
                    Masuk
                  </Button>
                </Link>
                <Link to="/regis">
                  <Button type="button" colorScheme="orange" variant="outline">
                    Daftar
                  </Button>
                </Link>
              </ButtonGroup>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
