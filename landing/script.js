// Smooth scroll pour les liens d'ancre
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gestion du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formMessage = document.getElementById('formMessage');
    const submitButton = this.querySelector('button[type="submit"]');
    
    // Désactiver le bouton pendant l'envoi
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    
    // Récupérer les données du formulaire
    const formData = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    try {
        // Envoyer vers l'API backend
        const response = await fetch('https://api.newstaq.com/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Succès
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.';
            
            // Réinitialiser le formulaire
            this.reset();
        } else {
            throw new Error('Erreur d\'envoi');
        }
    } catch (error) {
        // Erreur
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement à contact@newstaq.com';
    } finally {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.textContent = 'Envoyer';
    }
});
