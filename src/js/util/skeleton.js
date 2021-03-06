import { $$ } from './index.js';

const skeletonTemplate = `
  <div class="skeleton">
    <div class="image"></div>
    <p class="line"></p>
    <p class="line"></p>
  </div>
`;

export const renderSkeleton = ($target, repeatNumber) => {
  $target.insertAdjacentHTML('beforeend', skeletonTemplate.repeat(repeatNumber));
};

export const removeSkeleton = $target => {
  $$('.skeleton', $target).forEach($skeleton => {
    $skeleton.remove();
  });
};
