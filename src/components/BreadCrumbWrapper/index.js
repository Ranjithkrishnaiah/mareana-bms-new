import React, { useEffect, useState } from "react";

import { Breadcrumb } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";

import breadcrumbNameMap from "./map.json";
import "./style.scss";
import { HomeOutlined } from "@ant-design/icons";

const BreadCrumbWrapper = (props) => {
  const location = useLocation();
  if (props.urlName) {
    breadcrumbNameMap[props.urlName] =
      Number(props.value) === 0
        ? props.data
          ? props.data
          : "Untitled"
        : props.value;
  }
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Link to="/dashboard/dashboard">
      <HomeOutlined />
    </Link>,
  ].concat(extraBreadcrumbItems);
  return (
    <Breadcrumb className="bread-crumb-wrapper">{breadcrumbItems}</Breadcrumb>
  );
};

export default BreadCrumbWrapper;
