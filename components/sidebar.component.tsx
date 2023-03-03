import Image from "next/image";
import Link from "next/link";
import ceramicLogo from "../public/ceramicLogo.png";

import { FaHome, FaUser, FaHashtag } from "react-icons/fa";
import { SidebarProps } from "../types";

export const Sidebar = ({ hundle, username, id }: SidebarProps) => {
  return (
    <div className="sidebar">
      <div className="top">
        <Link href={`/profile`}>
          <a>
            <FaUser /> Profile
          </a>
        </Link>
      </div>
      <div className="bottom">
        {hundle !== undefined ? (
          <div className="you">
            <b>{hundle}</b> <br />
            {username}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
