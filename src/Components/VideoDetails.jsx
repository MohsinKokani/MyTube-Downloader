
const VideoDetails = ({imgPath, videoTitle}) => {
    return (
        <div className="videoDetails">
            <img src={imgPath} alt="thumbnail" />
            <div className="videoTitle row-spaced">
                {
                    videoTitle
                }
            </div>
        </div>
    )
}
export default VideoDetails;