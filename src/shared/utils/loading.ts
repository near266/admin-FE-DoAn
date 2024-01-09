class AppLoading {
  showloading(): void {
    const element = document.querySelector('body');

    // The HTML string to be appended
    const html = '<div id="app-loading"><div class="loader">Loading&#8230;</div></div>';

    // append
    element.insertAdjacentHTML('beforeend', html);
  }

  hideloading(): void {
    document.getElementById('app-loading')?.remove();
  }
}

export const appLibrary = new AppLoading();
