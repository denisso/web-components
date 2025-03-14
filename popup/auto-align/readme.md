# Popup Web Component

This repository contains a project for a customizable popup implemented using Web Components. The popup is designed to enhance user experience with various functional and code features.

## Functional Features

- **Automatic Vertical Alignment**: The popup automatically aligns vertically when added or removed from the DOM.
- **Auto Removal**: Popups are automatically removed after a specified time interval.
- **Animation Effects**: Smooth animations for appearance and disappearance, along with alignment adjustments.
- **Hover Interaction**: Animation pauses and resumes when the cursor hovers over the popup, providing a more interactive experience.

## Code Features

- **List Structure**: Utilizes a List structure for storing popups, reducing the need for frequent calls to `querySelectorAll`.
- **Minimized Reflow**: Reduces the number of reflows by separating size retrieval (`getBoundingClientRect()`) from the application of transforms. For more details, refer to [Article 1, Section "Subtle Aspects of Layout/Reflow"](link-to-article).
- **Optimized Redraw**: Initiates redraw using `requestAnimationFrame` in `createPopup` and optimizes rendering in a single frame during `verticalAlignPopups`.
- **Transform Usage**: Employs CSS transforms instead of positioning, which offers performance benefits. For further information, see [Article 1, Section "Rendering and Animation in a Separate Thread"](link-to-article).

## Installation

To get started with the Popup Web Component, clone the repository and include the component in your project.

```bash
git clone https://github.com/yourusername/popup-web-component.git
cd popup-web-component
```

## Usage

Include the popup component in your HTML and customize it as needed. Refer to the documentation for detailed usage instructions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
