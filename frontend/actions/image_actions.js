import * as APIUtil from '../api/images';

export const RECEIVE_IMAGES = 'RECEIVE_IMAGES';
export const RECEIVE_PAGINATION = 'RECEIVE_PAGINATION';
export const CLEAR_IMAGES = 'CLEAR_IMAGES';

export const receiveImages = images => ({
  type: RECEIVE_IMAGES,
  images,
});

export const receivePagination = pagination => ({
  type: RECEIVE_PAGINATION,
  pagination,
});

export const clearImages = () => ({
  type: CLEAR_IMAGES,
});

export const fetchImages = id => dispatch =>
  APIUtil.fetchImages(id).then(images => dispatch(receiveImages(images)));

export const fetchMainPageImages = () => dispatch =>
  APIUtil.fetchImages({ show_on_main_page: true }).then(paginated_images => {
    dispatch(receiveImages(paginated_images.images));
    dispatch(receivePagination(paginated_images.images));
  });
