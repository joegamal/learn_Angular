// import './CourseCard.css'

export default function CourseCard({courseName, courseDuration, coursePrice, children}) {
    return (
        <div className='CardContainer'>
            <h3>Course name: {courseName}</h3>
            <p>course duration: {courseDuration}</p>
            <p>course price: {coursePrice}</p>
            {children}
            <hr />
        </div>
    );
}