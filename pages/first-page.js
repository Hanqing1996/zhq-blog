import React from "react";
import Link from "next/link";

export default function X() {
    return (
        <div>
            <div>First page </div>
            点击 <Link href='./index'>这里</Link>返回首页
        </div>
    )
}