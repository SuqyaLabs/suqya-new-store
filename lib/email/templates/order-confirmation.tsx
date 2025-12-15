import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: string;
  shippingWilaya: string;
  shippingMethod: string;
  paymentMethod: string;
}

function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-DZ")} DA`;
}

export function OrderConfirmationEmail({
  customerName,
  orderNumber,
  items,
  subtotal,
  shippingCost,
  total,
  shippingAddress,
  shippingWilaya,
  shippingMethod,
  paymentMethod,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Votre commande {orderNumber} a été confirmée - Suqya سُقيا
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>🍯 سُقيا Suqya</Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Heading style={h1}>Merci pour votre commande !</Heading>
            <Text style={paragraph}>
              Bonjour {customerName},
            </Text>
            <Text style={paragraph}>
              Votre commande <strong>{orderNumber}</strong> a bien été enregistrée.
              Nous préparons votre colis avec soin.
            </Text>
          </Section>

          {/* Order Summary */}
          <Section style={orderSection}>
            <Heading as="h2" style={h2}>
              Récapitulatif de commande
            </Heading>
            
            {/* Items */}
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemInfo}>
                  <Text style={itemName}>
                    {item.productName}
                    {item.variantName && ` - ${item.variantName}`}
                  </Text>
                  <Text style={itemQuantity}>Quantité: {item.quantity}</Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={priceText}>{formatPrice(item.totalPrice)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={divider} />

            {/* Totals */}
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Sous-total</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={priceText}>{formatPrice(subtotal)}</Text>
              </Column>
            </Row>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Livraison ({shippingMethod})</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={priceText}>{formatPrice(shippingCost)}</Text>
              </Column>
            </Row>
            <Hr style={divider} />
            <Row style={totalRow}>
              <Column>
                <Text style={grandTotalLabel}>Total</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={grandTotalValue}>{formatPrice(total)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Shipping Info */}
          <Section style={infoSection}>
            <Heading as="h2" style={h2}>
              Adresse de livraison
            </Heading>
            <Text style={paragraph}>
              {shippingAddress}
              <br />
              {shippingWilaya}
            </Text>
          </Section>

          {/* Payment Info */}
          <Section style={infoSection}>
            <Heading as="h2" style={h2}>
              Mode de paiement
            </Heading>
            <Text style={paragraph}>
              {paymentMethod === "cod"
                ? "💵 Paiement à la livraison"
                : paymentMethod === "cib"
                ? "💳 Carte CIB/Edahabia"
                : "🏦 Virement bancaire"}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Des questions ? Contactez-nous sur WhatsApp au +213 555 123 456
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Suqya - Miel Bio d&apos;Algérie
            </Text>
            <Text style={footerArabic}>
              سُقيا - نغذي صحتك بهدايا الطبيعة
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#FFB300",
  padding: "24px",
  textAlign: "center" as const,
};

const logo = {
  color: "#1C1917",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
};

const content = {
  padding: "24px 40px",
};

const h1 = {
  color: "#1C1917",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const h2 = {
  color: "#1C1917",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#57534E",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 12px",
};

const orderSection = {
  backgroundColor: "#FAFAF9",
  borderRadius: "8px",
  margin: "0 40px 24px",
  padding: "24px",
};

const itemRow = {
  marginBottom: "16px",
};

const itemInfo = {
  verticalAlign: "top" as const,
};

const itemName = {
  color: "#1C1917",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const itemQuantity = {
  color: "#78716C",
  fontSize: "12px",
  margin: "4px 0 0",
};

const itemPrice = {
  textAlign: "right" as const,
  verticalAlign: "top" as const,
};

const priceText = {
  color: "#1C1917",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const divider = {
  borderColor: "#E7E5E4",
  margin: "16px 0",
};

const totalRow = {
  marginBottom: "8px",
};

const totalLabel = {
  color: "#78716C",
  fontSize: "14px",
  margin: "0",
};

const totalValue = {
  textAlign: "right" as const,
};

const grandTotalLabel = {
  color: "#1C1917",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
};

const grandTotalValue = {
  color: "#FFB300",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
};

const infoSection = {
  padding: "0 40px 24px",
};

const footer = {
  backgroundColor: "#1C1917",
  padding: "24px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#A8A29E",
  fontSize: "12px",
  margin: "0 0 8px",
};

const footerArabic = {
  color: "#FFB300",
  fontSize: "14px",
  margin: "16px 0 0",
};

export default OrderConfirmationEmail;
