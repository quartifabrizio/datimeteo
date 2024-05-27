<template>
  <div>
    <div>
      <center>
        <br>
        <h1>Precipitazioni(TOP 10)</h1>
        <br>
      </center>
      <div class="container">
        <table v-if="jsonData.length">
          <tbody>
            <tr v-for="(row, rowIndex) in top10ComuniPiovosi" :key="'precipitazioni-' + rowIndex" :class="{'highlighted-row': rowIndex === 0}">
              <td v-for="(value, key, index) in row" :key="key" :class="[
                { 'text-left': key === 'Comuni', 'text-right': key !== 'Comuni', 'comune-name': key === 'Comuni' },
                { 'hide-column': index === 0 } // Add this class to hide the first column
              ]">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br>
    <br>
    <div>
      <center>
        <h1>Temperature(TOP 10)</h1>
        <br>
      </center>
      <div class="container">
        <table v-if="jsonData.length">
          <tbody>
            <tr v-for="(row, rowIndex) in top10ComuniCaldi" :key="'temperature-' + rowIndex" :class="{'highlighted-row': rowIndex === 0}">
              <td v-for="(value, key, index) in row" :key="'temperature-' + key" :class="[
                { 'text-left': key === 'Comuni', 'text-right': key !== 'Comuni', 'comune-name': key === 'Comuni' },
                { 'hide-column': index === 0 } // Add this class to hide the first column
              ]">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <br>
  <br>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: 'ComuneView',
  data() {
    return {
      jsonData: [],
      originalData: [],
      editedCells: [],
      localStorageKey: 'temperature_data'
    }
  },
  computed: {
    top10ComuniCaldi() {
      return this.jsonData
        .slice()
        .sort((a, b) => b.Temperature - a.Temperature)
        .slice(0, 10);
    },
    top10ComuniPiovosi() {
      return this.jsonData
        .slice()
        .sort((a, b) => b.Precipitazioni - a.Precipitazioni)
        .slice(0, 10);
    }
  },
  mounted() {
    this.loadLocalData();
    if (!this.jsonData.length) {
      this.loadExcelFile();
    }
    this.saveLocalData();
  },
  methods: {
    async loadExcelFile() {
      try {
        const response = await fetch(new URL('@/assets/temperature.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let json = XLSX.utils.sheet_to_json(worksheet);

        json = json.filter(row => Object.values(row).some(cell => cell !== ''));

        this.jsonData = json;
        this.originalData = JSON.parse(JSON.stringify(json));
        this.saveLocalData();

        console.log('Array di elementi:', this.jsonData);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    },
    saveLocalData() {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.jsonData));
      localStorage.setItem('dati2', JSON.stringify(this.top10ComuniCaldi));
      console.log('Dati salvati:', JSON.parse(localStorage.getItem('dati2')));
    },
    loadLocalData() {
      const localData = localStorage.getItem(this.localStorageKey);
      if (localData) {
        this.jsonData = JSON.parse(localData);
      }
    }
  }
};
</script>
<style scoped>
.container {
  margin: 0 5%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.highlighted-row {
  background-color: aliceblue;
  font-weight: bold;
  color: #4295ef; /* Colore azzurro per gli indici delle colonne */
  font-size: 18px; /* Aumenta la dimensione del font delle intestazioni */
}
</style>
