import React, { useContext, useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { CgOptions } from "react-icons/cg";
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./Listing.css";
import { useQuery, useInfiniteQuery } from "react-query";
import { getUser, getVendors } from "../../utils/profile_helper";
import { Image, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import supabase from "../../utils/supabase.config";
import { useEffect } from "react";

const options = ["Recent", "Oldest"];
const filters = ["Sort by A-Z", "Sort by Z-A", "Sort by location"];
const defaultOption = options[0];

const Listing = () => {
  const navigate = useNavigate();
  const { data: profile, isLoadin: isLoading3 } = useQuery("profile", getUser);
  const [isLoading, setIsLoading] = useState(false);
  const [recent, setRecent] = useState(true);
  const [sortBy, setSortBy] = useState("created_at");
  // const [page, setPage] = useState(0);
  // const [data, setData] = useState([]);
  // let from, to;

  // const loadMoreData = () => {
  //   var ITEM_PER_PAGE = 2;
  //   from = page * ITEM_PER_PAGE;
  //   to = from + ITEM_PER_PAGE;
  //   if (page > 0) {
  //     from += 1;
  //   }
  //   return { from, to };
  // };

  // const { data: vendors } = useQuery(
  //   ["profile", profile?.id, page],
  //   async () => {
  //     const { from, to } = loadMoreData();
  //     return await getVendors(from, to); // Adjust your API call based on currentPage
  //   }
  // );

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: vendors,
  } = useInfiniteQuery(
    ["vendors", profile?.id, recent],
    ({ pageParam = 0 }) => getVendors(pageParam, recent, sortBy),
    {
      getNextPageParam: (lastPage, allPages) => {
        return allPages?.length;
      },
    }
  );

  async function increasePage() {
    try {
      setIsLoading(true);
      if (hasNextPage) {
        await fetchNextPage();
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log(vendors);
  }, [vendors]);

  return (
    <>
      {/* {isLoading? <div className="spin"><Spin /></div> : ""} */}
      <Header />
      <div className="filter">
        <Dropdown
          options={filters}
          value={"Filter"}
          placeholder={"Filter"}
          onChange={(e) => {
            if (e.value === "Sort by A-Z") {
              setSortBy("display_name");
              setRecent(true);
            } else if (e.value === "Sort by Z-A") {
              setSortBy("display_name");
              setRecent(false);
            } else if (e.value === "Sort by location") {
              setSortBy("location");
              setRecent(true);
            }
          }}
        />
        <Dropdown
          options={options}
          value={defaultOption}
          placeholder="Recent"
          onChange={(e) => {
            setRecent(e.value === "Recent" ? true : false);
          }}
        />
      </div>
      <hr />
      <div className="cardcontainer">
        {vendors?.pages?.map((page) => {
          return page?.map((vendor) => {
            return (
              <div
                className="listingcard"
                key={vendor?.id}
                onClick={() => navigate(`/profile/${vendor?.id}`)}
              >
                {vendor?.profile_pic ? (
                  <img src={vendor?.profile_pic} alt="bg" />
                ) : vendor?.cover_pic ? (
                  <img src={vendor?.cover_pic} alt="bg" />
                ) : (
                  <Image
                    width={200}
                    height={220}
                    src="error"
                    fallback="data:image/png;base64,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"
                    preview={false}
                  />
                )}

                <div className="listingname">
                  <p>{vendor?.display_name}</p>
                  <p>{vendor?.location}</p>
                  <p className="bio">{vendor?.bio}</p>
                </div>
                {/* <BsFillArrowUpRightSquareFill
                    onClick={() => navigate(`/profile/${vendor?.id}`)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#D9E167",
                      color: "#000",
                      margin: "10px 10px 0 0",
                      width: "6.10%",
                      height: "1.5em",
                      borderRadius: "3.5px",
                    }}
                  /> */}
              </div>
            );
          });
        })}
      </div>
      <div className="load">
        {isLoading ? (
          <Spin />
        ) : (
          <button onClick={increasePage}>Load more</button>
        )}
      </div>
      <br />
      <Footer />
    </>
  );
};

export default Listing;
