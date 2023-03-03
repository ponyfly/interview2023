defer和async的下载都不会阻塞浏览器的渲染

但是

async下载完成后，开始执行js,阻塞渲染

defer下载完成后，会在渲染完成后执行js
