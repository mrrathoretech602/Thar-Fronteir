// Inventory System for Havildar Devrath Singh
// Manages story items, documents, and carried tactical props (sandbags, ammo crates).

class InventoryManager {
    constructor() {
        this.items = {
            ticket: {
                id: 'ticket',
                name: 'रेलवे टिकट (Train Ticket)',
                desc: 'जैसलमेर से झुंझुनू (शेखावाटी) · 03 दिसंबर 1971',
                icon: '🎫',
                owned: true
            },
            toy_rattle: {
                id: 'toy_rattle',
                name: 'काठ का खिलौना (Wooden Toy Rattle)',
                desc: 'नवजात बेटी काव्या के लिए हाथ से तराशा हुआ छोटा झुंझुना।',
                icon: '🪀',
                owned: true
            },
            letter: {
                id: 'letter',
                name: 'माँ की चिट्ठी (Mother\'s Letter)',
                desc: 'शेखावाटी से डाक द्वारा आया पत्र जिसमें घर और बेटी की कुशलक्षेम लिखी है।',
                icon: '✉️',
                owned: true
            },
            binoculars: {
                id: 'binoculars',
                name: 'सैन्य दूरबीन (Military Binoculars)',
                desc: 'रेगिस्तान की सीमा पर दूर तक निगरानी करने के लिए फील्ड ग्लासेज।',
                icon: '🔭',
                owned: false
            },
            tanot_clay: {
                id: 'tanot_clay',
                name: 'तनोट माता की मिट्टी (Tanot Clay)',
                desc: 'सरहद की पवित्र मिट्टी — संकट में हौसला और एकाग्रता देती है।',
                icon: '🙏',
                owned: false
            },
            longewala_oath: {
                id: 'longewala_oath',
                name: 'लौंगेवाला संकल्प (Stand-To Oath)',
                desc: 'मेजर कुलदीप सिंह चांदपुरी के साथ अंतिम सांस तक पोस्ट न छोड़ने की शपथ।',
                icon: '🇮🇳',
                owned: false
            },
            carriedProp: null // 'sandbag' or 'ammo_crate'
        };
        this.ticketCancelled = false;
    }

    hasItem(id) {
        return !!(this.items[id] && this.items[id].owned);
    }

    giveItem(id, customItem = null) {
        if (!this.items[id] && customItem) {
            this.items[id] = {
                id,
                name: customItem.name || id,
                desc: customItem.desc || '',
                icon: customItem.icon || '🎖️',
                owned: true
            };
        } else if (this.items[id]) {
            this.items[id].owned = true;
        }
        this.updateUI();
    }

    markTicketCancelled(cancelled = true) {
        this.ticketCancelled = cancelled;
        if (this.items.ticket) {
            this.items.ticket.name = cancelled
                ? 'रद्द छुट्टी पास (Cancelled Pass)'
                : 'रेलवे टिकट (Train Ticket)';
            this.items.ticket.icon = cancelled ? '🎖️' : '🎫';
        }
        this.updateUI();
    }

    setCarriedProp(propType) {
        this.items.carriedProp = propType;
        this.updateUI();
    }

    getCarriedProp() {
        return this.items.carriedProp;
    }

    updateUI() {
        const bar = document.getElementById('inventory-items');
        if (!bar) return;
        bar.innerHTML = '';

        Object.keys(this.items).forEach(key => {
            if (key === 'carriedProp') return;
            const item = this.items[key];
            if (item.owned) {
                const el = document.createElement('div');
                el.className = 'inv-item';
                el.title = item.name + ' - ' + item.desc;
                el.innerHTML = `<span class="inv-icon">${item.icon}</span> <span class="inv-label">${item.name}</span>`;
                el.addEventListener('click', () => {
                    if (key === 'letter') {
                        if (window.cutsceneManager) window.cutsceneManager.showLetterModal();
                    } else if (key === 'ticket') {
                        if (window.cutsceneManager) window.cutsceneManager.showTicketModal(null, this.ticketCancelled);
                    } else if (key === 'binoculars') {
                        if (window.cutsceneManager) window.cutsceneManager.showBinoculars();
                    }
                });
                bar.appendChild(el);
            }
        });

        if (this.items.carriedProp) {
            const carried = document.createElement('div');
            carried.className = 'inv-item carrying';
            carried.innerHTML = `<span class="inv-icon">📦</span> <span class="inv-label">हाथ में: ${this.items.carriedProp === 'sandbag' ? 'रेत की बोरी (Sandbag)' : 'गोला-बारूद पेटी (Ammo Crate)'}</span>`;
            bar.appendChild(carried);
        }
    }
}

window.inventoryManager = new InventoryManager();

