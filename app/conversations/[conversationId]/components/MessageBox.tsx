"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import { FullMessageType } from "@/app/types";

import Avatar from "@/app/components/Avatar";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const messageContainer = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-purple-500 text-white" : "bg-purple-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );
  const messageText = clsx(
    "object-cover cursor-pointer hover:scale-110 transition translate",
    data.image && "w-full h-full"
  );

  return (
    <div className={container}>
      <div className={clsx(isOwn && "order-2")}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {formatRelative(new Date(data.createdAt), new Date())}
          </div>
        </div>
        <div className={messageContainer}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              className={messageText}
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
