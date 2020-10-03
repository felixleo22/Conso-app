<template>
     <v-container>
       <v-row>
         <v-col
          cols="12"
          md="10"
          offset-md="1"
          offset-xl="3"
          xl="6"
        >

          <!-- List display -->
          <v-card>
            <v-list>
              <template v-for="(item, index) in shoppingList">
                <div :key="index">
                  <v-divider v-if="index != 0"></v-divider>
                  <v-list-item two-line style="padding-left: 0.5em; padding-right: 0.5em;">
                    <v-list-item-avatar tile>
                      <v-img :src="item.icon"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{item.name}}</v-list-item-title>
                      <v-list-item-subtitle>{{item.brand}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-text-field
                        type="number"
                        min="1"
                        step="1"
                        single-line
                        v-model="item.quantity"
                        style="max-width: 2.5em;"
                        @input="update(item)"
                      >
                      </v-text-field>
                    </v-list-item-action>
                    <v-list-item-action style="margin-left: 0.25em;">
                      <v-btn
                        @click="del(item)"
                        icon
                      >
                        <v-icon color="red accent-4">fa-trash</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </div>
              </template>
            </v-list>
          </v-card>

          <!-- Load spinner -->
          <v-container v-if="!shoppingList">
            <v-row>
              <v-spacer></v-spacer>
                <v-progress-circular
                  indeterminate
                  color="red accent-4"
                >
                </v-progress-circular>
              <v-spacer></v-spacer>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
export default {
  props: ['idShoppingList'],
  name: 'list',
  data() {
    return {
    };
  },
  mounted() {
    this.$store.dispatch('getShoppingList', this.idShoppingList);
  },
  methods: {
    del(item) {
      this.$store.dispatch('setLoading', true);

      this.$store.dispatch('removeItem', item)
        .finally(() => {
          this.$store.dispatch('setLoading', false);
        });
    },
    update(item) {
      if (item.quantity < 1) {
        // eslint-disable-next-line no-param-reassign
        return;
      }
      this.$store.dispatch('setLoading', true);
      this.$store.dispatch('updateItem', item)
        .finally(() => {
          this.$store.dispatch('setLoading', false);
        });
    },
  },
  computed: {
    shoppingList() {
      return this.$store.getters.shoppingList;
    },
  },
};

</script>
