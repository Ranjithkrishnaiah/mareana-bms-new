import Service from "./AjaxService";
import { BMS_APP_PYTHON_SERVICE } from "../constants/apiBaseUrl";

//get site id
export const getSiteId = (_queryParam) => {
  return Service.get(BMS_APP_PYTHON_SERVICE + "/site_ids", _queryParam).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error.response.data;
    }
  );
};

//get chart type
export const getChartList = (request) => {
  let login_response = JSON.parse(localStorage.getItem("login_details"));

  const headers = {
    "content-type": "application/json",
    "x-access-token": login_response.token ? login_response.token : "",
    "resource-name": "VIEW",
  };
  return Service.get(
    BMS_APP_PYTHON_SERVICE + "/chart-list",
    request,
    headers
  ).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error.response.data;
    }
  );
};

//get chart obj
export const getChartObj = (request) => {
  return Service.get(BMS_APP_PYTHON_SERVICE + "/chart", request).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error;
    }
  );
};

//put chart obj
export const putChartObj = (request) => {
  return Service.put(BMS_APP_PYTHON_SERVICE + "/chart", request).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error.response.data;
    }
  );
};

export const viewBatchData = (request) => {
  return Service.post(BMS_APP_PYTHON_SERVICE + "/views", request).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error.response.data;
    }
  );
};

//get rule list
export const getRuleList = (request) => {
  return Service.get(BMS_APP_PYTHON_SERVICE + "/rules", request).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error;
    }
  );
};

//get chart plot data
export const postChartPlotData = (_queryParam) => {
  let login_response = JSON.parse(localStorage.getItem("login_details"));
  const headers = {
    "content-type": "application/json",
    "x-access-token": login_response.token ? login_response.token : "",
    "resource-name": "chart",
  };
  return Service.post(
    BMS_APP_PYTHON_SERVICE + "/chart-object",
    _queryParam,
    headers
  ).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error.response.data;
    }
  );
};

//save chart data
export const saveChartPlotData = (_queryParam) => {
  let login_response = JSON.parse(localStorage.getItem("login_details"));
  const headers = {
    "content-type": "application/json",
    "x-access-token": login_response.token ? login_response.token : "",
    "resource-name": "chart",
  };
  return Service.put(
    BMS_APP_PYTHON_SERVICE + "/chart-object",
    _queryParam,
    headers
  ).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error.response.data;
    }
  );
};

//get chart data
export const getChartPlotData = (_queryParam) => {
  let login_response = JSON.parse(localStorage.getItem("login_details"));
  const headers = {
    "content-type": "application/json",
    "x-access-token": login_response.token ? login_response.token : "",
    "resource-name": "VIEW",
  };
  return Service.get(
    BMS_APP_PYTHON_SERVICE + "/chart-object",
    _queryParam,
    headers
  ).then(
    (response) => {
      return response.data;
    },
    (error) => {
      return error.response.data;
    }
  );
};
