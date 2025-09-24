import Filters from "@/components/Filters";
import ShopsCard from "@/components/ShopsCard";
import type { Shop } from "@/models/shop";
import { Box, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import './Stores.css'

const Stores = () => {
  const [shop, setShop] = useState<Shop[]>([]);
  const [limit, setLimit] = useState<number>(8);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<any>();

  const toast = useToast();

  const handleShopDataFromChild = (data: any) => {
    setShop(data);
  };

  const fetchAllShops = async (limit: number, page: number) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }api/shops/list?page=${page}&limit=${limit}`
      );
      const data = await res.json();
      if (res.ok) {
        setShop(data.shops);
        setPagination(data.pagination);
      } else {
        toast({
          title: "Error while loading shops",
          duration: 5000,
          status: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllShops(limit, page);
  }, [limit, page]);
  console.log(pagination);

  return (
    <div className="mt-32">
      <Box
        mx={{
          base: 4,
          sm: 6,
          md: 12,
          lg: 16,
        }}
      >
        <Filters sendShopDataToParent={handleShopDataFromChild} />
      </Box>
      <Box
        className="flex justify-between flex-wrap mt-8"
        mx={{
          base: 4,
          sm: 6,
          md: 12,
          lg: 16,
        }}
      >
        {shop &&
          shop.map((shop, index) => (
            <ShopsCard shop={shop} isView={false} key={index} />
          ))}
      </Box>
      <Box
        className="p-4 mt-16"
        mx={{
          base: 4,
          sm: 6,
          md: 12,
          lg: 16,
        }}
      >
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
          <div className="-mt-px flex w-0 flex-1">
            <Text
              className={`inline-flex items-center border-t-2 pt-4 pr-1 text-sm font-medium ${
                page === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700 cursor-pointer"
              }`}
              onClick={() => page > 1 && setPage(page - 1)}
              tabIndex={page > 1 ? 0 : -1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="mr-3 h-5 w-5 text-gray-300"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Previous
            </Text>
          </div>
          <div className="hidden md:-mt-px md:flex">
            {Array.from({ length: pagination?.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Text
                  key={pageNum}
                  className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium cursor-pointer ${
                    page === pageNum
                      ? "selected-page"
                      : "unselected-page"
                  }`}
                  onClick={() => setPage(pageNum)}
                  tabIndex={page !== pageNum ? 0 : -1}
                  onKeyUp={(e)=> {
                    if(e.key === 'Enter' || e.key === ' ') {
                      setPage(pageNum)
                    }
                  }}
                >
                  {pageNum}
                </Text>
              )
            )}
          </div>
          <div className="-mt-px flex w-0 flex-1 justify-end">
            <Text
              className={`inline-flex items-center border-t-2 pt-4 pr-1 text-sm font-medium ${
                page === pagination?.totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700 cursor-pointer"
              }`}
              onClick={() => page < pagination?.totalPages && setPage(page + 1)}
              tabIndex={page < pagination?.totalPages ? 0 : -1}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="ml-3 h-5 w-5 text-gray-400"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Text>
          </div>
        </nav>
      </Box>
    </div>
  );
};

export default Stores;
