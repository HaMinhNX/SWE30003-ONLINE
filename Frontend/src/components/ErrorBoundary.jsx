// // src/components/ErrorBoundary.jsx
// import { Component } from 'react';

// export class ErrorBoundary extends Component {
//     state = { hasError: false, error: null };
//     static getDerivedStateFromError(err) {
//         return { hasError: true, error: err };
//     }
//     render() {
//         if (this.state.hasError) {
//             return <div className="p-8 text-red-600">Có lỗi: {this.state.error.message}</div>;
//         }
//         return this.props.children;
//     }
// }
