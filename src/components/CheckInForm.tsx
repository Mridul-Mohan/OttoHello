@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);

     try {
       const reason = formData.reason_to_visit === 'Others'
         ? formData.custom_reason
         : formData.reason_to_visit;

       await visitorAPI.checkInVisitor({
         full_name: formData.full_name,
         phone_number: formData.phone_number,
         person_to_meet_id: formData.person_to_meet_id,
         reason_to_visit: reason,
         photo_url: photoUrl
       });

       onSuccess();
     } catch (error) {
       console.error('Error checking in visitor:', error);
+      alert('Failed to check in. Please try again.');
     } finally {
       setLoading(false);
     }
   };