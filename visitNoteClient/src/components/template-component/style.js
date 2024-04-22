import Styled from "styled-components";

const Div = Styled.div`
margin: 0 0 20px;
    .ant-page-header {
        margin: 0 0 20px;
    }
    div[class*="EditorToolbar__root"] {
      // display: none;
      border: none;
      padding: 0;
      margin: 0;
      position: absolute;
      right: 0;
      bottom: -40px;
      div[class*="ButtonGroup__root"]:not(:is(:nth-child(7))) {
        display: none;
      }
    }
`;

const MailBox = Styled.div`
    border: 1px solid #DCE3EE;
    border-radius: 4px; 
  .editer-txt { 
  }
  .reply-inner{
    width: 100%;
    border-bottom: 1px solid ${({ theme }) =>
      theme["border-color-light"]} !important;
  }
  input{
    border: 0 none;
    border-bottom: 1px solid ${({ theme }) => theme["border-color-light"]};
  }
  .react-tagsinput{
    ${({ theme }) => (theme.rtl ? "padding-right" : "padding-left")}: 0;
    border: 0 none;
    input{
      border: 0 none;
    }
    input::placeholder{
      color: ${({ theme }) => theme["light-color"]};
    }
    .react-tagsinput-tag{
      padding: 5px 16px;
      border: 0 none;
      border-radius: 16px;
      color: ${({ theme }) => theme["gray-color"]};
      background: ${({ theme }) => theme["bg-color-normal"]};
      .react-tagsinput-remove{
        ${({ theme }) => (theme.rtl ? "padding-right" : "padding-left")}: 8px;
        color: ${({ theme }) => theme["light-color"]};
      }
    }
  }
  .ant-upload-list{
    position: absolute;
    bottom: 15%;
    ${({ theme }) => (theme.rtl ? "right" : "left")}: 25px;
    width: 95%;    
  }
  input{
    padding: 15px 0;
    &:focus{
      box-shadow: 0 0;
    }
  }
  input::placeholder{
    color: ${({ theme }) => theme["light-color"]};
  }

  .header {
    padding: 20px;
    color: #fff;
    border-radius: 10px 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${({ theme }) => theme["dark-color"]};
    p {
      margin: 0;
      padding: 0;
    }
    .icon-right {
      svg {
        cursor: pointer;
        opacity: .70;
      }
      svg:first-child {
        ${({ theme }) => (!theme.rtl ? "margin-right" : "margin-left")}: 20px;
      }
    }
  }
  .body-editer { 
    .group { 
      position: relative;
      @media only screen and (max-width: 575px){
        padding: 0px 15px;
      }
      >div{
        box-shadow: none;
        border: none;
        background: none;
        border-radius: 0; 
        &.showEditorToolbar {
          >div[class*="EditorToolbar__root"] {
            display: block;
            div[class*="ButtonGroup__root"]:not(:is(:nth-child(6), :nth-child(7))) {
                display: none;
            }
          }
          .public-DraftEditor-content {
            height: 300px;
            font-family: "Montserrat", sans-serif;
          }
        }
        &.editorDotPr {
          div[class*="EditorToolbar__root"] {
            display: none;
          }
        }
      }
      .mail-cc{
        position: absolute;
        ${({ theme }) => (!theme.rtl ? "right" : "left")}: 30px;
        color: ${({ theme }) => theme["light-color"]};
      }
      .DraftEditor-root{
        font-size: 14px;
        font-family: 'Inter', sans-serif
      }
    }
    .public-DraftEditorPlaceholder-root{
        // color: #000000;
        font-family: "Montserrat", sans-serif;
    }
    .public-DraftEditor-content {
      height: 180px;
      font-family: "Montserrat", sans-serif;
    }
  }
  .footer-editer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left{
      button,
      a{
        ${({ theme }) => (!theme.rtl ? "margin-right" : "margin-left")}: 20px;
        line-height: 1;
        svg{
          color: ${({ theme }) => theme["light-color"]};
        }
      }
      .ant-upload {
        margin-top: 4px;
      }
      .ant-upload-list{
        overflow: hidden;
        .ant-upload-list-item{
          border-radius: 4px;
          height: 25px;
          line-height: 2.5;
          z-index: 10;
          background: ${({ theme }) => theme["bg-color-normal"]};
          .ant-upload-list-item-name{
            font-size: 13px;
          }
          .ant-upload-list-item-card-actions{
            top: -4px;
          }
        }
      }
    }
    .right{
      line-height: 1;
      a{
        color: ${({ theme }) => theme["light-color"]};
      }
    }
    .footer-list {
        display: flex;
        gap: 6px;
        padding: 8px;
        .ant-btn {
            height: 24px;
            width: 24px;
            min-width: 24px;
            padding: 0;
            &.ant-btn-icon-only {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .ant-btn-icon {
                width: 20px;
            }
        }
    }
  }
  div[class*="EditorToolbar__root"] {
    button {
      border: none;
      box-shadow: none;
      background: none;
    }
    select {
      outline: none;
    }
    select+span {
      border-color: #DCE3EE !important;
      border-radius: 3px !important;
    }
  } 
`;

const CardBarChart2 = Styled.div`
    display: flex;
    flex-wrap: wrap;
    .icon-box {
        border-radius: 4px;
        overflow: hidden;
        width: 100px;
        height: 100px;
        img {
            width: 100%;
            aspect-ratio: 1;
            object-fit: cover;
        }
    }
    .card-chunk {
        padding-left: 15px;
        width: calc(100% - 100px);
        h2 {
            font-size: 18px;
            margin: 0;
        }
        h6 {
            margin: 0 0 8px;
            font-size: 14px;
            font-weight: 400;
        }
        p {
            margin: 0;
            font-size: 14px;
            label {
                color: #6F767F;
                font-weight: 600;
            }
        }
    }
`;

const BarChartList = Styled.div`
    .chartList-items {
      display: flex;
      flex-wrap: wrap;
     .chart-item {
        width: 50%;
        margin: 0 0 40px;
        .ant-typography {
          margin: 0 0 10px;
        }
        .ant-typography-edit, .anticon {
          color: #3C9762;
        }
        .ant-list-items {
          padding: 0 0 0 12px;
          .ant-list {
            padding: 0 0 10px;
          }
        .ant-list-item {
          padding: 0 0 0 12px;
          border: none;
          font-weight: normal;
          position: relative;
          &:before {
            content: "";
            position: absolute;
            left: 0;
            top: 9px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #000;
          }
        }
      }
     }
    }
     
`;

export { Div, MailBox, CardBarChart2, BarChartList };
