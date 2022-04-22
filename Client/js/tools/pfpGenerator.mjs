export class ProfilePic {

    static backgroundColors = [
        '#4284e4',
        '#986ee2',
        '#692649',
        '#e5534b',
        '#cc6b2c',
        '#ae7c13',
        '#46954a'
    ];

    static generate(initials, width = 250) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = width;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = this.backgroundColors[Math.randomRange(0, this.backgroundColors.length - 1)];
        ctx.fillRect(0, 0, width, width);

        // Initials
        ctx.fillStyle = '#DDDDDD';
        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        ctx.font = `bold ${width * .46}px SegoeUI`;
        ctx.fillText(initials, canvas.width / 2, canvas.height * .64);

        return canvas.toDataURL('image/png').replace(' ', '');
    }

    static imageToBase64(imageElement, width = 250) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const imgWidth = imageElement.naturalWidth;
        const imgHeight = imageElement.naturalHeight;
        const smallestEdge = imgWidth < imgHeight ? imgWidth : imgHeight;
        const imgScale = width/smallestEdge;
        ctx.drawImage(image, -(imgWidth-smallestEdge) / 2, -(imgHeight-smallestEdge) / 2, imgWidth * imgScale, imgHeight * imgScale);

        return canvas.toDataURL('image/png');
    }

}