import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Loader, CheckCircle, XCircle, CameraOff } from 'lucide-react';

const CameraAttendance = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Chargement des modèles IA...');
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState(null);
  const [students, setStudents] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [error, setError] = useState(null);
  const [detectionCounts, setDetectionCounts] = useState({});

  // Load models and student data
  useEffect(() => {
    const setup = async () => {
      try {
        // Load models
        const MODEL_URL = '/models'; // Use absolute path
        await Promise.all([
          faceapi.nets.tinyYolov2.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]);

        // Fetch students from Firestore
        setLoadingMessage('Chargement de la liste des étudiants...');
        const studentsCollection = collection(db, 'students');
        const studentSnapshot = await getDocs(studentsCollection);
        const studentList = studentSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, status: 'Absent' }));
        setStudents(studentList);
        
        // Initialize detection counts
        const initialCounts = {};
        studentList.forEach(student => {
          initialCounts[student.name] = 0;
        });
        setDetectionCounts(initialCounts);

        // Create face descriptors
        setLoadingMessage('Analyse des visages de référence...');
        const descriptors = [];
        for (const student of studentList) {
          try {
            const img = await faceapi.fetchImage(student.imageUrl);
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (detection) {
              descriptors.push(new faceapi.LabeledFaceDescriptors(student.name, [detection.descriptor]));
            } else {
              console.warn(`Aucun visage détecté pour ${student.name}.`);
            }
          } catch (e) {
            console.error(`Erreur de chargement de l'image pour ${student.name}`, e);
          }
        }
        setLabeledFaceDescriptors(new faceapi.FaceMatcher(descriptors, 0.55));
        setLoading(false);
        setLoadingMessage('');
      } catch (err) {
        setError(`Erreur d'initialisation: ${err.message}`);
        setLoading(false);
        console.error(err);
      }
    };
    setup();
  }, []);

  // Face detection interval
  useEffect(() => {
    if (loading || !isCameraActive || !labeledFaceDescriptors) return;

    const interval = setInterval(async () => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        
        if (canvasRef.current) {
          faceapi.matchDimensions(canvasRef.current, displaySize);
        }

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyYolov2Options()).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        if (canvasRef.current) {
          const context = canvasRef.current.getContext('2d');
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        
        if (resizedDetections.length > 0 && labeledFaceDescriptors) {
          const recognizedNames = new Set();
          resizedDetections.forEach(detection => {
            const bestMatch = labeledFaceDescriptors.findBestMatch(detection.descriptor);
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { 
              label: `${bestMatch.label} (${Math.round(bestMatch.distance * 100)}%)`,
              boxColor: bestMatch.label === 'unknown' ? 'red' : 'green'
            });
            if (canvasRef.current) {
              drawBox.draw(canvasRef.current);
            }

            if (bestMatch.label !== 'unknown') {
              recognizedNames.add(bestMatch.label);
            }
          });

          // Update detection counts
          setDetectionCounts(prevCounts => {
            const newCounts = { ...prevCounts };
            students.forEach(student => {
              if (recognizedNames.has(student.name)) {
                newCounts[student.name] = (newCounts[student.name] || 0) + 1;
              } else {
                // Reset if not detected in this frame
                newCounts[student.name] = 0;
              }
            });
            return newCounts;
          });
        }
      }
    }, 500); // Scan every 0.5 seconds

    return () => clearInterval(interval);
  }, [loading, isCameraActive, labeledFaceDescriptors, students]);

  // Update student status based on detection counts
  useEffect(() => {
    Object.keys(detectionCounts).forEach(studentName => {
      if (detectionCounts[studentName] >= 3) {
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.name === studentName && student.status !== 'Présent'
              ? { ...student, status: 'Présent' }
              : student
          )
        );
      }
    });
  }, [detectionCounts]);

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const toggleStudentStatus = (studentId) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, status: student.status === 'Présent' ? 'Absent' : 'Présent' }
          : student
      )
    );
  };

  const allPresent = students.every(s => s.status === 'Présent');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Appel Automatisé</h1>
          <p className="text-center text-gray-500 mb-8">La reconnaissance faciale marque automatiquement les étudiants présents.</p>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
              <p className="font-bold">Erreur</p>
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Camera View */}
            <div className="relative flex flex-col items-center justify-center bg-gray-900 rounded-lg overflow-hidden shadow-inner">
              {loading ? (
                <div className="flex flex-col items-center text-white">
                  <Loader className="animate-spin h-12 w-12 mb-4" />
                  <p className="text-lg">{loadingMessage}</p>
                </div>
              ) : isCameraActive ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-auto"
                  videoConstraints={{ facingMode: 'user' }}
                />
              ) : (
                <div className="flex flex-col items-center text-white p-16">
                  <CameraOff className="h-16 w-16 mb-4" />
                  <h3 className="text-xl font-semibold">Caméra en pause</h3>
                </div>
              )}
              <canvas ref={canvasRef} className="absolute top-0 left-0" />
            </div>

            {/* Student List */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">Liste d'appel (Classe 3A)</h2>
              <div className="space-y-3 h-96 overflow-y-auto pr-2">
                {students.map(student => (
                  <div 
                    key={student.id} 
                    onClick={() => toggleStudentStatus(student.id)}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer hover:bg-gray-200 ${
                      student.status === 'Présent' ? 'bg-green-100 shadow-sm' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={student.imageUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="font-medium text-gray-800">{student.name}</span>
                    </div>
                    {student.status === 'Présent' ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex flex-col items-center">
            {allPresent && (
              <div className="bg-green-200 text-green-800 text-center font-bold py-3 px-6 rounded-lg mb-4">
                Tous les étudiants ont été marqués comme présents !
              </div>
            )}
            <button
              onClick={toggleCamera}
              className={`px-8 py-3 rounded-full font-semibold text-white transition-transform transform hover:scale-105 shadow-lg ${
                isCameraActive ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
              disabled={loading}
            >
              {isCameraActive ? 'Mettre la caméra en pause' : 'Réactiver la caméra'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraAttendance;