import Styled from "styled-components";

const Div = Styled.div`
    position: relative;
    background: #262626; 
    .ant-layout {
        font-family: "Montserrat", sans-serif;
    }
    >.layout {
        background: none;
    } 
    aside.ant-layout-sider {
        position: fixed;
        top: 0px;
        bottom: 0px;
        left: 0px;
        z-index: 1000;
        background: #151515;
    }
    .demo-logo {
        padding: 0 20px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .nav-toggle-btn {
            padding: 0;
            background: none !important;
            color: #fff !important;
            border: none;
            font-size: 32px;
            width: 32px;
            height: 32px;
            position: absolute;
            right: -10px;
            bottom: -10px;
            line-height: 1;
        }
    } 
    .aside-menu {
        height: calc(100vh - 180px);
    }
    .aside-menu, .aside-profile {
        padding: 15px 15px 20px; 
        .ant-menu {
            background: none;
            a::before {
                content: none;
            }
            .ant-menu-item {
                color: #BFBFBF;
                font-size: 18px;
                padding-inline: 0px;
                &:hover {
                    color: #fff !important;
                }
                &.ant-menu-item-selected {
                    background: #404142;
                    color: #fff !important;
                }
                .menuItem-iocn {
                    font-size: 20px;
                }
                &:nth-child(3),
                &:nth-child(6) {
                    margin-bottom: 50px;
                }
            }
            .user-profile {
                .ant-menu-item-icon {
                    width: 30px;
                    height: 30px;
                    object-fit: cover;
                    aspect-ratio: 1;
                    border-radius: 50%;
                    margin: 5px auto;
                    display: block;
                }
            }
        }
    }
    .atbd-main-layout{
        ${({ theme }) => (!theme.rtl ? "margin-left" : "margin-right")}: ${({
  theme,
}) => (theme.topMenu ? 0 : "280px")};
        padding: 10px;
        background: none;
        transition: 0.3s ease; 
        @media only screen and (max-width: 1150px){
            ${({ theme }) =>
              !theme.rtl ? "margin-left" : "margin-right"}: auto !important;
        }
        main.ant-layout-content { 
        }
    }
    .ant-layout-sider-collapsed { 
        .ant-menu-title-content { 
        }
        & + .atbd-main-layout{
            ${({ theme }) =>
              !theme.rtl ? "margin-left" : "margin-right"}: 80px;
        } 
    }
    .menu-gap {
        margin-top: 50px;
    }

    .ant-page-header-heading {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .ant-page-header-heading-title {
            font-size: 20px;
            font-weight: 600;
        }
        .page-header-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            .ant-btn {
                display: flex;
                align-items: center;
                justify-content: center; 
                gap: 5px;
            }
        }
    }
    .ant-page-footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .page-footer-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
    } 
`;

export { Div };
