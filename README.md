# 🚗⚡ Electric Vehicle Analytics Dashboard

An interactive data visualization dashboard for analyzing electric vehicle population data in Washington State. Built with Next.js, TypeScript, and D3.js for comprehensive EV market insights.

## 🚀 Live Demo

**[View Live Dashboard](http://ec2-3-111-50-83.ap-south-1.compute.amazonaws.com/)** ⚡

Experience the full functionality of the EV Analytics Dashboard with real-time data visualization and interactive features.

## 🌟 Features

### 📊 **Interactive Data Visualization**
- **Multi-chart Dashboard**: Pie charts, bar charts, line graphs, and histograms
- **Dynamic Filtering**: Filter by manufacturer, year range, and vehicle types
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔍 **Advanced Analytics**
- **Manufacturer Comparison**: Side-by-side analysis of multiple EV manufacturers
- **Single Manufacturer Deep Dive**: Comprehensive analysis for individual brands
- **Geographic Distribution**: County and city-level EV registration analysis
- **Temporal Analysis**: Year-over-year registration trends and patterns
- **Range Analysis**: Electric vehicle range distribution and statistics

### 📈 **Key Metrics & Insights**
- Total vehicle registrations and growth trends
- Average electric range by manufacturer and model
- Battery Electric Vehicle (BEV) vs. Plug-in Hybrid (PHEV) distribution
- Clean Alternative Fuel Vehicle (CAFV) eligibility status
- Top-performing counties and cities for EV adoption
- Legislative district analysis and electric utility breakdowns

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **UI Framework**: [React 19](https://reactjs.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) for responsive design
- **Data Visualization**: [D3.js 7](https://d3js.org/) for advanced charting
- **Data Processing**: [PapaParse](https://www.papaparse.com/) for CSV parsing
- **Build Tool**: [Turbopack](https://turbo.build/) for faster development builds

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.17 or later
- **npm**: Version 9.0 or later (comes with Node.js)
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd map_up_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm run start
```

## 📁 Project Structure

```
map_up_frontend/
├── public/
│   ├── data.csv              # EV population dataset
│   └── *.svg                 # Static assets and icons
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout with metadata
│   │   ├── page.tsx          # Home page component
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── Dashboard.tsx     # Main dashboard container
│   │   ├── Chart.tsx         # D3.js chart components
│   │   ├── Filters.tsx       # Filter panel component
│   │   ├── StatsCard.tsx     # Statistics display cards
│   │   ├── ComparisonCharts.tsx  # Manufacturer comparison
│   │   └── ...              # Other UI components
│   ├── dto/                  # TypeScript interfaces
│   │   ├── ev-data.dto.ts    # EV data type definitions
│   │   ├── chart-data.dto.ts # Chart data interfaces
│   │   └── ...              # Other type definitions
│   ├── lib/                  # Utility functions
│   │   └── dataUtils.ts      # Data processing utilities
│   └── constants/            # Application constants
├── Dockerfile                # Docker configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.js        # TailwindCSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 💡 Usage Guide

### 🎯 **Basic Navigation**
1. **Overview Dashboard**: View comprehensive EV statistics and trends
2. **Apply Filters**: Use the filter panel to narrow down data by manufacturer or year
3. **Compare Manufacturers**: Select multiple manufacturers and toggle comparison mode
4. **Single Manufacturer Analysis**: Select one manufacturer for detailed insights

### 🔧 **Filter Options**
- **Manufacturer Selection**: Multi-select dropdown for EV brands
- **Year Range**: Slider to filter by model year (2000-2024)
- **Comparison Mode**: Toggle to switch between overview and comparison views

### 📊 **Chart Types**
- **Pie Charts**: EV type distribution, CAFV eligibility status
- **Bar Charts**: Top manufacturers, county distributions
- **Line Charts**: Year-over-year registration trends
- **Histograms**: Electric range distribution analysis

### 🏭 **Advanced Features**
- **Manufacturer Comparison**: Compare up to 5 manufacturers across multiple metrics
- **Geographic Insights**: County and city-level adoption patterns
- **Temporal Analysis**: Registration trends and growth patterns
- **Range Analytics**: Electric vehicle range statistics and distributions

## 🎨 Design Features

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for mobile devices with touch-friendly interactions
- **Tablet Support**: Adapted layouts for tablet screens
- **Desktop Enhanced**: Full feature set with expanded visualizations

### 🎭 **User Experience**
- **Loading States**: Smooth loading animations and progress indicators
- **Error Handling**: Graceful error messages and recovery options
- **Accessibility**: WCAG-compliant color schemes and keyboard navigation
- **Performance**: Optimized rendering with virtual scrolling and lazy loading

## 📊 Data Source

The dashboard analyzes the **Electric Vehicle Population Dataset** from Washington State, including:

- **Vehicle Information**: Make, model, year, VIN, and type
- **Geographic Data**: County, city, postal code, and coordinates
- **Technical Specs**: Electric range, MSRP, and vehicle type
- **Administrative Data**: Legislative districts and utility providers
- **Eligibility Status**: Clean Alternative Fuel Vehicle (CAFV) qualification

## 🔧 Development

### 📋 **Available Scripts**

```bash
# Development with Turbopack (faster builds)
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm run start

# Run ESLint for code quality
npm run lint
```

### 🐳 **Docker Support**

```bash
# Build Docker image
docker build -t ev-analytics-dashboard .

# Run container
docker run -p 3000:3000 ev-analytics-dashboard
```

### 🛠️ **Code Quality**
- **ESLint**: Configured with Next.js and TypeScript rules
- **TypeScript**: Strict type checking for better code quality
- **Prettier**: Code formatting (recommended to set up)

### 🧪 **Testing** (Future Enhancement)
- **Jest**: Unit testing framework (setup recommended)
- **Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing for user workflows

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🔄 **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 **Contribution Guidelines**
- Follow the existing code style and TypeScript patterns
- Add proper type definitions for new features
- Ensure responsive design compatibility
- Test across different screen sizes and devices
- Update documentation for significant changes

### 🐛 **Bug Reports**
When reporting bugs, please include:
- Browser and version information
- Screen resolution and device type
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable

### 💡 **Feature Requests**
For new features, consider:
- User experience and accessibility impact
- Performance implications for large datasets
- Mobile and responsive design compatibility
- Integration with existing chart types and filters

## 📄 License

This project is part of the MapUp assessment and is intended for evaluation purposes.

## 🙏 Acknowledgments

- **Washington State Department of Licensing** for providing the EV population dataset
- **D3.js Community** for exceptional data visualization capabilities
- **Next.js Team** for the robust React framework
- **TailwindCSS** for the utility-first CSS framework
- **MapUp** for the opportunity to build this analytics platform

---

## 📞 Support

For questions, issues, or suggestions:
- **Create an Issue**: Use GitHub Issues for bug reports and feature requests
- **Documentation**: Refer to the inline code comments and type definitions
- **Community**: Engage with other developers through discussions

---

**Built with ❤️ for EV analytics and sustainable transportation insights**