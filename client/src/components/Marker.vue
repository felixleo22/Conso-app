<template>
 <l-marker : lat-lng="[ " + {{ lat }} + "," + {{ long }} + " ]">
        <l-icon
          :icon-anchor="staticAnchor"
          class-name="someExtraClass"
        >
          <div class="headline">
            {{ storeName }}
          </div>
          <img src= {{ photo }} style="width:20px; ">
        </l-icon>
      </l-marker>
</template>

<script>

        let app = new Vue({
            el: "#application", //On fait du Vue dans le div nommé "application"
            data: {
                listeOfMagasins: [],
                storeName: 'Magasin',
                lat : 48.6833,
                long : 6.2,
                photo : "./test.png",
            },
        });
</script>
