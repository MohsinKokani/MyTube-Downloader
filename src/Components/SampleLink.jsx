
const SampleLink = () => {
    let copyIt = () => {
        let input = document.querySelector(".copy-text input");
        let copyText = document.querySelector(".copy-text");
        input.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        copyText.querySelector("button").style.background = '#00ff1e';
        setTimeout(function () {
            copyText.querySelector("button").style.background = '#5784f5';
        }, 2500);
    };
    return (
        <div className="copy-text">
            <h3>Sample Link:</h3>
            <input type="text" readOnly className="text" value="https://youtu.be/HY2x9YT_voQ" />
            <button onClick={copyIt}><i className="fa fa-clone"></i></button>
        </div>
    )
}
export default SampleLink;