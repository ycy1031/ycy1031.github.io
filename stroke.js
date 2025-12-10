document.addEventListener("DOMContentLoaded", () => {
  const svgGroups = document.querySelectorAll(".hero-stroke");

  svgGroups.forEach((svg, groupIndex) => {
    const paths = svg.querySelectorAll("path, polyline, polygon");
    paths.forEach((path, i) => {
      const length = path.getTotalLength();

      // stroke 길이에 맞게 세팅
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      // 그룹별 + 경로별로 살짝씩 딜레이
      const delay = groupIndex * 1.2 + i * 0.1; 
      path.style.animation = `draw-stroke 1.4s ease forwards ${delay}s`;
    });
  });
});
