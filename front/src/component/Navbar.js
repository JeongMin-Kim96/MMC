import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector, useStore } from "react-redux";
import { authAction } from "../redux/actions/authAction";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { getCookieToken, getUserId } from "../storage/Cookie";
import alarm from "./alarm";
import { Cookies } from "react-cookie";
import { userinfoAction } from "./../redux/actions/userinfoAction";
import { display } from "@mui/system";
import styled from "styled-components";
import { ConstructionOutlined } from "@mui/icons-material";
const MenuName = styled.div`
font-size: 14px;
font-weight: bold;
  margin-left: 5px;
  `;
const MenuInfo = styled.div`
  width: 160px;
  height: 30px;
  display: flex;
  margin: 10px 10px 5px 10px;
  padding: 5px 10px;
  font-size: 12px;
  justify-content: space-between;
  background-color: #e5e5e5;
  `;
const Point = styled.span`
  color: rgba(69, 64, 225, 0.6);
  font-size: 14px;
  `;
const MenuInfoItem = styled(MenuItem)(({ theme }) => ({
  textAlign: "right",
}));
const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState([])
  const is_loaded = useSelector((state) => state.question.is_loaded);
  const getUserInfo = useSelector(state => state.userinfo.userinfo)
  const getAuthenticated = useSelector(state => state.authToken.authenticated)
  console.log("인증", authenticated)
  const cookie = new Cookies()
  const userId = cookie.get("userId");
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    if (
      is_loaded === true
    ) {
      console.log('111')
      console.log("쿠키유저아이디", userId)
      console.log("인증", authenticated)
      setAuthenticated(true)
    }
  }, [is_loaded])
  useEffect(() => {
    if (userId !== 0) {
      console.log('유저아이디 들어가는거 확인', userId)
      dispatch(userinfoAction.getUserInfo(userId))
    }
  }, [authenticated])
  useEffect(() => {
    setUserInfo(getUserInfo)
    console.log("유저정보확인", getUserInfo)
  }, [getUserInfo])


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  let openmypage = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
  };

  const goPoint = () => {
    handleClose();
    navigate(`/mypage/point`);
  };
  const goquestion = () => {
    handleClose();
    navigate(`/mypage/question`);
  };
  const golecture = () => {
    handleClose();
    navigate(`/mypage/lecture`);
  };
  const logout = () => {
    handleClose();
    // console.log("엑세스토큰,유저아이디 호출", authenticated, userId);
    console.log(userId);
    dispatch(authAction.onLogout(userId));
    setAuthenticated(false)
    navigate("/");
  };
  return (
    <div>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Grid
            container
            direction="row"
            justifyContent="flex-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <Link variant="button" href="/" sx={{ my: 1, mx: 1.5 }}>
                <img width="60" src="/img/mmclogo.png" alt="logo" />
              </Link>
              <Link
                variant="button"
                color="text.primary"
                href="/question"
                sx={{ my: 1, mx: 1.5 }}
              >
                전체질문
              </Link>
            </Grid>
            <Grid item xs={6} >
              <Box sx={{ minWidth: 300, textAlign: 'right' }}>
                {authenticated === true ? (
                  <div>
                    <Grid item>
                      <Button
                        id="mypage-button"
                        // aria-controls={openmypage ? "basic-menu" : undefined}
                        // aria-haspopup="true"
                        // aria-expanded={openmypage ? "true" : undefined}
                        onClick={handleClick}
                      >
                        마이페이지
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openmypage}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "mypage-button",
                        }}
                      >
                        <MenuItem>
                          <Avatar
                            src={userInfo?.profileImage}
                            sx={{ width: 32, height: 32 }}
                          />
                          <MenuName>{userInfo?.nickname}</MenuName>
                        </MenuItem>
                        <MenuInfo>
                          <div>포인트</div>
                          <div>
                            <Point>{userInfo?.point}</Point> points
                          </div>
                        </MenuInfo>
                        <MenuItem onClick={goPoint}>포인트 페이지</MenuItem>
                        <MenuItem onClick={goquestion}>내 질문 페이지</MenuItem>
                        <MenuItem onClick={golecture}>내 강의 페이지</MenuItem>
                        <MenuItem onClick={logout}>로그아웃</MenuItem>
                      </Menu>
                    </Grid>
                  </div>
                ) : (
                  <Button
                    href="/login"
                    variant="outlined"
                    color="secondary"
                    sx={{ my: 1, mx: 1.5 }}
                  >
                    Login
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default Navbar;
