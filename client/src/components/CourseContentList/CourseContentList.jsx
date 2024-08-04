import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import CourseContent from '../CourseContent/CourseContent';
import './CourseContentList.css';

function CourseContentList() {
  const courses = useSelector(state => state.coursesReducer.courses);
  const courseContentList = useSelector(state => state.courseContentListReducer.courseContentList);
  const { viewedVideos } = useSelector(state => state.cabinetReducer.viewedVideos);

  const dispatch = useDispatch();
  const { id } = useParams();
  const [certificatePath, setCertificatePath] = useState(null);

  const currentCourse = courses && courses.length ? courses.find(course => course.id === Number(id)) : null;
 
  useEffect(() => {
    dispatch({ type: 'GET_FETCH_COURSE_CONTENT_LIST', payload: { id } });
  }, [dispatch, id]);

  useEffect(() => {dispatch({ type: 'GET_FETCH_ALL_COURSES' })}, [dispatch])

  useEffect(() => {
    if (currentCourse && currentCourse.certificate) {
      setCertificatePath(currentCourse.certificate);
    }
  }, [currentCourse]);

  let matchingCourseTitle = currentCourse ? currentCourse.name : null;

  // calculate whether or not we should certify the user
  let allowCertificate = false;

  if (currentCourse && currentCourse.isCertified) {
    const viewedVideosArray = [];
    const viewedVideosBoolArray = [];
  
    if (courseContentList && courseContentList.length) {
      for (const courseContent of courseContentList) {
        let viewedCourseContent = viewedVideos && viewedVideos.length ? viewedVideos.find(video => video.courseContentId === courseContent.id) : null;
        if (viewedCourseContent) {
          viewedVideosBoolArray.push(true);
          viewedVideosArray.push(viewedCourseContent);
        } else {
          viewedVideosBoolArray.push(false);
        }
      }
    }
  
    let notWatchedVideo = viewedVideosBoolArray.some(viewedVideoBoolean => viewedVideoBoolean === false)
  
    let maxPlayedSecondsTotal = 0
    let totalSecondsTotal = 0
  
    const finishedViewedVideosArray = [];
    if (!notWatchedVideo) {
      for (const viewedVideo of viewedVideosArray) {
        // compute the total number of seconds watched and the cumulative seconds across all videos in the course
        maxPlayedSecondsTotal += viewedVideo.maxPlayedSeconds
        totalSecondsTotal += viewedVideo.totalSeconds
  
        if (viewedVideo.maxPlayedSeconds) {
          if (viewedVideo.maxPlayedSeconds >= viewedVideo.totalSeconds * 0.85) {
            finishedViewedVideosArray.push(true);
          } else {
            finishedViewedVideosArray.push(false);
          }
        } else {
          finishedViewedVideosArray.push(false);
        }
      }
    }
  
    let noFinishedViewedVideo = finishedViewedVideosArray.some(viewedVideoBoolean => viewedVideoBoolean === false);
    if (noFinishedViewedVideo === false && !notWatchedVideo) {
      allowCertificate = true;
    }
  }

  // // Calculate whether maxPlayedSecondsTotal is at least 50% of totalSecondsTotal
  // const isAtLeast50Percent = maxPlayedSecondsTotal >= 0.5 * totalSecondsTotal;
  // if (isAtLeast50Percent) {
  //   dispatch({ type: 'INCREAUSE_COURSE_WATCHERS_COUNT', payload: { courseId: id }});
  // }

  function onClickHandler(event) {
    event.preventDefault();
    dispatch({ type: 'CREATE_CERTIFICATE', payload: { courseId: id }});
  }

  return (
    <div>
      {matchingCourseTitle ? <h3 id="course-title">{matchingCourseTitle}</h3> : <p>No matching course found</p>}
      <ul>
        {courseContentList.length ? courseContentList.map((courseContent) =>
          <CourseContent key={courseContent.id} courseContent={courseContent} />) : <li>No course content</li>}
      </ul>
      { allowCertificate && !certificatePath && (
          <button type="button" onClick={onClickHandler}>Click to receive certificate</button>
      )}
      {certificatePath && (
        <div>
          <p>Click the link below to download your certificate:</p>
          <a href={certificatePath} download>Download Certificate</a>
        </div>
      )}

    </div>
  );
}

export default CourseContentList;
