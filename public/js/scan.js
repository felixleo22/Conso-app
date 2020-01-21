/* eslint-disable no-undef */

$(() => {
    // Create the QuaggaJS config object for the live stream
    const liveStreamConfig = {
        inputStream: {
            type: 'LiveStream',
            constraints: {
                aspectRatio: { min: 1, max: 100 },
                facingMode: 'environment',
                // or "user" for the front camera
            },
        },
        locator: {
            patchSize: 'medium',
            halfSample: true,
        },
        numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
        decoder: {
            readers: [
                { format: 'ean_reader', config: {} },
            ],
        },
        locate: true,
    };
    // The fallback to the file API requires a different inputStream option.
    // The rest is the same
    const fileConfig = $.extend(
        {},
        liveStreamConfig,
        {
            inputStream: {
                size: 800,
            },
        },
    );
    // Start the live stream scanner when the modal opens
    $('#livestream_scanner').on('shown.bs.modal', () => {
        Quagga.init(
            liveStreamConfig,
            (err) => {
                if (err) {
                    $('#livestream_scanner .modal-body .error').html(`<div class="alert alert-danger"><strong><i class="fa fa-exclamation-triangle"></i> ${err.name} </strong>: ${err.message} </div>`);
                    Quagga.stop();
                    return;
                }
                Quagga.start();
            },
        );
    });

    // Make sure, QuaggaJS draws frames an lines around possible
    // barcodes on the live stream
    Quagga.onProcessed((result) => {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
                result.boxes.filter((box) => box !== result.box).forEach((box) => {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
            }
        }
    });

    // Once a barcode had been read successfully, stop quagga and
    // close the modal after a second to let the user notice where
    // the barcode had actually been found.
    Quagga.onDetected((result) => {
        if (result.codeResult.code) {
            $('#scanner_input').val(result.codeResult.code);

            Quagga.stop();
            setTimeout(() => { $('#livestream_scanner').modal('hide'); }, 1000);
            const settings = {
                url: `/api/product/${result.codeResult.code}`,
                method: 'GET',
                'Content-Type': 'application/json',
            };
            $.ajax(settings).done((response) => {
                $('#result').text(response.data.product_name);
            });
        }
    });

    // Stop quagga in any case, when the modal is closed
    $('#livestream_scanner').on('hide.bs.modal', () => {
        if (Quagga) {
            Quagga.stop();
        }
    });

    // Call Quagga.decodeSingle() for every file selected in the
    // file input
    $('#livestream_scanner input:file').on('change', (e) => {
        if (e.target.files && e.target.files.length) {
            Quagga.decodeSingle($.extend({}, fileConfig, {
                src: URL.createObjectURL(e.target.files[0]),
            }), (result) => { alert(result.codeResult.code); });
        }
    });
});
