export const hideDropDown = () =>{
    document.addEventListener('click', function(event) {
      const allSelectiveElements = document.querySelectorAll('.dropdown-btn');
      allSelectiveElements.forEach(button=>{
        const sibling = button.nextElementSibling;
        if (!button.contains(event.target)) {
          if (button.classList?.contains("selective")) {
            button?.classList?.remove("selective")
          }
          if (sibling.classList?.contains("selective")) {
            sibling?.classList?.remove("selective")
          }
        }
      })
    });
  }