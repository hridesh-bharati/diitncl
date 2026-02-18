import React from "react";
import CommanCourse from "./CommanCourse";
import ScrollDownArrow from "../../../HelperCmp/Scroller/ScrollDown";

export default function OurCourses() {
    return <div  className="pb-5 pb-lg-0">
        <CommanCourse targetCourses={["All"]} CTitle="Computer" /> <ScrollDownArrow />
    </div>
}
