/**
 * 传给puppeteer的内置指令参数
 * --disable-gpu 禁用GPU硬件加速
 * --disable-dev-shm-usage  /dev/shm分区在某些虚拟机环境中太小，导致Chrome出现故障或崩溃（请参阅http://crbug.com/715363). 使用此标志可以解决此问题（将始终使用临时目录来创建匿名共享内存文件）
 * --start-maximized    最大限度地启动浏览器，而不考虑以前的任何设置
 * --no-sandbox linux特有参数
 */
export const CHROME_ARGS = ['--disable-gpu', '--disable-dev-shm-usage', '--start-maximized', '--no-sandbox']
