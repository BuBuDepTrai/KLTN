import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00";

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart ? item.cart.reduce((acc, i) => acc + i.qty, 0) : 0,
        total: `${new Intl.NumberFormat('de-DE').format(item.totalPrice)}đ`,
        status: item.status,
      });
    });

  const orderStatusCount = orders
    ? orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {})
    : {};

  const orderData = {
    labels: Object.keys(orderStatusCount),
    datasets: [
      {
        label: "Orders Count",
        data: Object.values(orderStatusCount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Orders Percentage",
        data: Object.values(orderStatusCount).map(count => (count / orders.length) * 100),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      }
    ],
  };

  const orderOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            if (tooltipItem.datasetIndex === 1) {
              return tooltipItem.raw.toFixed(2) + "%";
            }
            return tooltipItem.raw;
          }
        }
      }
    }
  };

  const productStatusCount = products
    ? products.reduce((acc, product) => {
        const status = product.inStock ? "In Stock" : "Out of Stock";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {})
    : {};

  const productData = {
    labels: Object.keys(productStatusCount),
    datasets: [
      {
        label: "Products",
        data: Object.values(productStatusCount),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)"
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderWidth: 1,
      },
    ],
  };

  const productOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Account Balance Pie Chart
  const balanceData = {
    labels: ["Available", "Threshold"],
    datasets: [
      {
        data: [availableBalance, 100 - availableBalance], // Example values, adjust as needed
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(201, 203, 207, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(201, 203, 207, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const balanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Account Balance{" "}
              <span className="text-[16px]">(with 10% service charge)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{new Intl.NumberFormat('de-DE').format(availableBalance)}đ</h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] text-[#077f9c]">Withdraw Money</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{orders && orders.length}</h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{products && products.length}</h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid rows={row} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Order Status Distribution</h3>
      <div className="w-full min-h-[45vh] bg-white rounded p-4">
        <Bar data={orderData} options={orderOptions} />
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Product Statistics</h3>
      <div className="w-full min-h-[45vh] bg-white rounded p-4">
        <Bar data={productData} options={productOptions} />
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Account Balance Statistics</h3>
      <div className="w-full min-h-[45vh] bg-white rounded p-4">
        <Pie data={balanceData} options={balanceOptions} />
      </div>
    </div>
  );
};

export default DashboardHero;
