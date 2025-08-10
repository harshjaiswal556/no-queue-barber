import { Box, Heading } from "@chakra-ui/react"

const Customer = () => {
  return (
    <div>
            <Box className="bg-white p-6 mx-auto">
              <Heading
                as="h2"
                size={"lg"}
                m={16}
                color={"var(--primary-foreground-color)"}
                className="text-center"
              >
                All My Bookings
              </Heading>
              <Box
                mx={{
                  base: 4,
                  sm: 6,
                  md: 12,
                  lg: 16,
                }}
              >
              </Box>
            </Box>
    </div>
  )
}

export default Customer
